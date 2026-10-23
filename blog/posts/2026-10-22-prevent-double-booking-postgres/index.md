---
title: "Preventing Double Bookings in Postgres with SELECT FOR UPDATE"
date: "Oct 22, 2026"
excerpt: "Two members, one spot left. How Move stops overbooking with Postgres row locks, the race reproduced without them, and two lock mistakes found along the way."
slug: "prevent-double-booking-postgres"
tags: "building-apps, postgres, concurrency, drizzle"
---

A class in [Move](/#work), the gym management app I'm building, has 10 spots. Nine are booked. Two members open the app and tap "Book" at the same moment.

Exactly one of them should get the spot. The other should see "This session is full". If both get in, the coach walks into a class with 11 people and 10 bikes.

This post covers how Move prevents that with a Postgres row lock, a reproduction of the race without the lock, and two mistakes around that lock: one that could freeze every booking at once, and one I only found while writing this post.

:::tldr
**Problem:** two people booking the last spot at the same moment can both get in, because each checks the count before the other has written.

**Fix:** lock the class's row with `SELECT … FOR UPDATE` inside the booking transaction, so the second request waits and sees the real count. Keep the lock short, and lock only the table you're changing (`FOR UPDATE OF sessions`).
:::

## The obvious code has a race condition

The natural way to write a booking looks like this:

```ts
const session = await db.select().from(sessions).where(eq(sessions.id, sessionId));
if (session.bookedCount >= session.capacity) {
  throw new SessionFullError();
}
await insertBooking(clientId, sessionId);
await db.update(sessions).set({ bookedCount: sql`booked_count + 1` }).where(eq(sessions.id, sessionId));
```

It reads the count, checks it, then writes. That's a **check-then-act** pattern, and it breaks the moment two requests interleave: both read 9, both decide there's room, both insert.

You don't need to take my word for it. I ran two transactions against Postgres 16 that do exactly this, with a one-second pause between the check and the write to make the overlap certain:

```text
B booked (saw 9/10)
A booked (saw 9/10)
final: 11/10
```

Both requests saw 9 of 10 and both booked. The class is overbooked, and no error was raised anywhere.

:::warning
Wrapping the code in a transaction doesn't fix this on its own. At Postgres's default isolation level (`READ COMMITTED`), a plain `SELECT` takes no lock, so two transactions can still read the same count and both act on it.
:::

## The fix: lock the row with SELECT … FOR UPDATE

`SELECT … FOR UPDATE` reads a row **and locks it** until the transaction ends. Any other transaction that tries to lock the same row waits until the first one commits or rolls back. Then it reads the row again and sees the new value.

Same experiment, with `FOR UPDATE` added to the read:

```text
B booked (saw 9/10)
A rejected: full (saw 10/10)
final: 10/10
```

B got the lock first and booked. A waited, then read the real count of 10 and was turned away. Exactly one booking, no matter how the requests are timed.

Here's the race as an interactive demo. Play it with and without the lock:

::demo[booking-race]

## How Move's booking transaction is built

Move uses [Drizzle ORM](https://orm.drizzle.team/) on Postgres. Stripped down to the parts that matter for concurrency, the booking service looks like this:

```ts
await db.transaction(async (tx) => {
  // 1. Lock the client: one person's double-taps run one at a time.
  const client = await repository.lockClient(tx, clientId);

  // 2. Lock the session: the real guard on capacity.
  const session = await repository.findSessionForUpdate(tx, sessionId);
  if (session.bookedCount >= session.capacity) {
    throw new SessionFullError("Session is at capacity");
  }

  // 3. Write everything while still holding both locks.
  const booking = await repository.insertBooking(tx, { clientId, sessionId, idempotencyKey });
  await chargeStrategy.chargeFor(tx, { clientId, refBookingId: booking.id /* ... */ });
  await repository.incrementSessionBookedCount(tx, sessionId);
  await repository.appendAuditLogEntry(tx, { action: "BOOKING_CREATED" /* ... */ });
});

// 4. Only after COMMIT: send the confirmation emails.
await sendBookingEmails(booking.id);
```

In Drizzle, the lock is `.for("update")` on the select:

```ts
const [session] = await tx
  .select({ capacity: sessions.capacity, bookedCount: sessions.bookedCount /* ... */ })
  .from(sessions)
  .where(eq(sessions.id, sessionId))
  .for("update");
```

Three rules hold this together.

### 1. Always take locks in the same order

Every booking locks the **client first, then the session, then the credit lot** it spends from. If one request locked session → client while another locked client → session, each could end up holding the lock the other needs. That's a deadlock, and Postgres resolves it by killing one of the transactions.

Locking the client also covers a quieter case: a member double-tapping "Book" on two different classes that overlap in time. Their two requests now run one after another, so the overlap check in the second one sees the first booking.

### 2. Nothing slow happens while the lock is held

Everything inside the transaction is a fast local Postgres statement: about eight of them per booking, including the credit deduction and the audit log entry. There's no payment gateway call, no HTTP request and no email under the lock.

Confirmation emails are sent **after** the transaction commits. If the email provider takes three seconds to respond, the next person booking that class doesn't wait three seconds for the lock.

### 3. Every check that depends on shared state runs after the lock

The capacity check, the "has the class already started?" check, and the overlap check all run after the locks are taken. A check done before locking is a check against data that may already be out of date.

## Mistake 1: a second connection inside the transaction

This one was a real bug, fixed in September.

Charging for a booking calls `pickCreditLot`, which decides which of the member's credit packs to spend from (the one expiring soonest). It ran its query like this:

```ts
// inside chargeFor(tx, ...), while the booking transaction holds its locks
const candidates = await db.select().from(creditLots).where(/* ... */);
```

Note `db`, not `tx`. `db` is the connection pool, so this query borrowed a **second** connection while the transaction was still holding its first one.

With a pool of 10 connections, that's a trap:

1. Ten members book at once. Each booking transaction takes one connection: the pool is now empty.
2. Each of them reaches `pickCreditLot` and asks the pool for a second connection.
3. None is free, and none will be: every connection belongs to a transaction that's waiting for another connection.

Every booking hangs at once, and at the time there was no timeout to break the wait. It's not a deadlock Postgres can detect, because Postgres never sees the waiting: it's the pool, in the application.

The fix was to pass the transaction through:

```ts
const candidates = await tx.select().from(creditLots).where(/* ... */);
```

I also added bounds so that if a future code path makes the same mistake, it fails loudly instead of freezing:

```ts
export const db = drizzle({
  connection: {
    connectionString: env.DATABASE_URL,
    max: 10,
    statement_timeout: 30_000,                  // no statement (or lock wait) runs longer than 30s
    idle_in_transaction_session_timeout: 30_000, // no transaction sits open doing nothing for 30s
    connectionTimeoutMillis: 10_000,            // waiting for a pool connection fails after 10s
  },
});
```

:::tip
Inside a transaction callback, every query should use the transaction handle (`tx`), never the global client. A lint rule or a repository interface that requires `tx` as an argument makes this mistake hard to write.
:::

## Mistake 2: locking more than one table

I found this one while writing this post.

The real `findSessionForUpdate` doesn't only read `sessions`. It joins `session_types` too, to get the class's credit type in the same query:

```ts
.from(sessions)
.innerJoin(sessionTypes, eq(sessions.sessionTypeId, sessionTypes.id))
.where(eq(sessions.id, sessionId))
.for("update");
```

Drizzle turns that into a plain `FOR UPDATE`. In Postgres, `FOR UPDATE` without a table list locks the matching rows in **every table in the query**. So this locks the session row and the `session_types` row for "HIIT".

That means two members booking **different** HIIT classes (the 7am and the 6pm) wait for each other, because both transactions want the same `session_types` row. Every HIIT booking in the gym runs one at a time.

I checked it with two transactions, the second with a one-second `lock_timeout`:

```text
-- for update: A locks the 7am HIIT, B wants the 6pm HIIT
B: ERROR:  canceling statement due to lock timeout
B: CONTEXT:  while locking tuple (0,1) in relation "session_types"

-- for update of s
B: 2
B took 0.03s
```

The fix is to name the table to lock. In SQL that's `FOR UPDATE OF sessions`; in Drizzle:

```ts
.for("update", { of: sessions });
```

At a small gym's booking volume this costs milliseconds, which is why nothing broke. But it would be one of the first things to hurt on a busy morning, and it's invisible from the code unless you know the rule.

## What's still missing

The row lock prevents overbooking, but it's the only thing that does. Some gaps are worth knowing about.

**No database constraint as a backstop.** If someone removed `.for("update")` by accident, nothing would stop an overbook. A `CHECK` constraint would make the database itself refuse it:

```sql
ALTER TABLE sessions
  ADD CONSTRAINT sessions_booked_count_within_capacity
  CHECK (booked_count <= capacity);
```

With that in place, the eleventh booking fails with a constraint error instead of silently succeeding.

**One popular class is a queue.** Every booking for the same class takes the same lock, even when 8 spots are left. If 200 people try to book the 7am class the second it opens, they run one at a time. Each holds the lock for a few milliseconds, so that's fine for a gym, but the wait is real. `statement_timeout` caps it at 30 seconds; a shorter `lock_timeout` for the booking transaction would fail faster and let the client retry.

## Other ways to prevent double booking

`SELECT … FOR UPDATE` isn't the only option. Here's how the common approaches compare:

| Approach | How it works | Good for | Watch out for |
| --- | --- | --- | --- |
| `SELECT … FOR UPDATE` | Lock the row, check, write | Several checks before the write (capacity, timing, credits) | Hot rows queue; lock only what you need |
| Conditional `UPDATE` | `UPDATE sessions SET booked_count = booked_count + 1 WHERE id = $1 AND booked_count < capacity RETURNING id` | A single counter with one rule | Hard to fit more checks into one statement |
| `SERIALIZABLE` isolation | Postgres aborts transactions that would conflict | Complex invariants across many rows | Every caller must retry on serialization errors |
| `CHECK` constraint | The database rejects an invalid state | A backstop under any of the above | Only checks one row; turns a race into an error, not a queue |

Move uses `FOR UPDATE` because a booking checks a lot more than capacity: whether the class has started, whether the member's membership is paused, whether they have a valid credit, whether it overlaps another booking. All of those need a consistent view of the data, and a row lock gives that with ordinary code.

## Frequently asked questions

### How do I prevent double booking in Postgres?

Run the capacity check and the insert in one transaction, and read the row with `SELECT … FOR UPDATE` so concurrent bookings for the same slot wait for each other. Add a `CHECK (booked_count <= capacity)` constraint as a backstop.

### Does a transaction alone prevent race conditions?

No. At the default `READ COMMITTED` isolation level, two transactions can read the same row and both act on the stale value. You need a row lock, a conditional update, or `SERIALIZABLE` isolation.

### Does SELECT FOR UPDATE lock the whole table?

No, only the rows the query returns. But with a join, it locks the matching rows in **every** joined table unless you write `FOR UPDATE OF <table>`.

### How do I use FOR UPDATE in Drizzle ORM?

Call `.for("update")` on the select query inside `db.transaction()`. Pass `{ of: table }` as the second argument to lock only one table in a join: `.for("update", { of: sessions })`.

## Wrapping up

Preventing double bookings comes down to one line: lock the row before you check it. The interesting part is everything around that line: keeping the lock short, taking locks in the same order, never borrowing a second connection inside the transaction, and locking only the table you mean to.

If you're building something similar, try the race yourself: two `psql` sessions, a `pg_sleep(1)` between the check and the write, and watch the count go to 11.

More posts from building Move are under [Building Apps](/blog/tags/building-apps/).
