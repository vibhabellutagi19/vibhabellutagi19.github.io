---
title: "Authentication Explained: Sessions vs JWT"
date: "Nov 22, 2026"
readTime: "9 min read"
excerpt: "Logging in seems simple, but the server forgets you the moment it replies. How sessions and JWTs each remember you, and how to choose between them."
slug: "auth-sessions-vs-jwt"
tags: "backend-concepts, authentication, sessions, jwt"
---

Logging in seems simple. You type your password, click a button, and you're in.

But the server forgets you the moment it replies. Your very next click has to prove who you are all over again.

> A session keeps your login on the server. A JWT keeps it inside the token. Everything else follows from that.

This is Part 1 of a three-part series on authentication. It explains how websites remember that you logged in, and the two common ways to do it: sessions and JWTs.

:::tldr
**Problem:** HTTP forgets who you are after every request, so the server needs a way to recognise you on the next one.

**Fix:** check the password once, then give the browser something to show on every request. A **session ID** points to a record the server keeps. A **JWT** carries the record itself, signed by the server. Use sessions unless many services need to check the user without looking anything up.
:::

## HTTP Forgets You After Every Request

Here's Alice logging in to an online shop, then opening her orders page:

```text
POST /login   (email + password)   →  200 OK
GET  /orders                       →  401 Unauthorized
```

Her password was right, and the server said so. One click later, it has no idea who she is.

That's not a bug. HTTP is **stateless**: every request arrives on its own, with no memory of the one before it. As [MDN puts it](https://developer.mozilla.org/en-US/docs/Web/Security/Authentication/Session_management), HTTP "provides no built-in mechanism to correlate a series of individual HTTP requests". In plain words, the server can't tell that two requests came from the same person.

This is on purpose. Because no request depends on the one before it, any server can answer any request. A shop running ten servers can send Alice's login to server 1 and her orders request to server 7, and neither needs to know about the other. That's a big part of how websites handle a lot of users at once.

::demo[auth-http-forgets]

### Sending the password every time doesn't work

The easy fix is to send the email and password with every request, so the server can check them each time.

It works, but it's a bad idea:

- **The password travels all the time.** Every request, every log line and every tool that sees the traffic is another chance for it to leak.
- **The browser has to keep the password** somewhere, so it can attach it to each request.
- **You can't log out one device.** If your phone is stolen, the only way to lock it out is to change your password, which logs you out everywhere.

What we want is this: **check the password once, at login. Then give Alice something else to show on every request after that.**

That something comes in two kinds. The server can keep a record of Alice and give her a token that points to it, like a cloakroom token. Or it can write the record down, stamp it, and hand her the whole thing, like a passport. The first is a session. The second is a JWT.

## Sessions: The Server Remembers You

With a session, the server does the remembering. After Alice logs in, it saves a small record, something like "this visitor is Alice, logged in until 6 pm". Then it gives her browser a **session ID**, a key that points to that record.

The ID is random on purpose. It isn't built from Alice's name or email. The server asks the computer's secure random generator for a long string of bytes. In Node, that's one line:

```js
crypto.randomBytes(32).toString("base64url");
// "0PXJ4AhTnj8YDL3an3HA9VOEMZTqsIzYwP0YHwltIBs"
```

Because it's long and random, nobody can guess another user's ID, and the ID itself tells you nothing about Alice.

Think of a cloakroom:

- **The counter (the server).** It keeps your bag, and it decides when to give it back.
- **The token (the session ID).** A number on a piece of plastic. It means nothing on its own. If the counter gives your bag away, the token is worthless.

The record lives in one place, on the server, so this is called **centralized session management**. The server stays in control: it can end Alice's session at any time by deleting the record.

### How the ID travels: cookies

A **cookie** is a small piece of text the server asks the browser to save. After that, the browser sends it back automatically with every request to that website.

The server sets it in its response:

```http
Set-Cookie: session_id=0PXJ4AhTnj8Y...; HttpOnly; Secure
```

And on every request after that, the browser adds:

```http
Cookie: session_id=0PXJ4AhTnj8Y...
```

That's how the session ID goes along with every click, without the website's code doing anything.

### Login, every request, logout

1. **Login.** The server checks Alice's password, saves the record, and sends the session ID in a cookie.
2. **Every request.** The browser sends the cookie. The server looks up the record, finds Alice, and returns her orders.
3. **Logout.** The server deletes the record. The cookie may still be in the browser, but it points to nothing now, so it's useless straight away.

::demo[auth-session-cloakroom]

Sessions also have an end time. When it passes, the record is gone and Alice has to log in again. Getting this right is harder than it looks: I wrote about [a session that logged users out while they were still active](/blog/better-auth-logged-out-while-active), because the server renewed the record but the browser's cookie never got the new time.

Two settings on that `Set-Cookie` line keep the ID safe:

- **`HttpOnly`**: the page's JavaScript can't read the cookie, so a malicious script can't steal it.
- **`Secure`**: the cookie is only sent over HTTPS, so nobody on the network can read it on the way.

## JWT: The Token Remembers You

With a **JWT** (JSON Web Token, often said "jot"), the server doesn't save anything. It writes "this is Alice, valid until 6 pm" into the token itself, then **signs** it. The signature is like a stamp only the server can make.

Now any server that knows how to check the stamp can trust the token without looking anything up. That's why JWTs are popular when many servers or apps need to know who Alice is.

Think of a passport:

- **The details are printed on it.** Your name, your photo and the expiry date. Nobody needs to look you up.
- **The stamp makes it trustworthy.** A border officer checks the stamp instead of calling the passport office. Once it's issued, it stays valid until it expires.

The record travels with Alice instead of living in one place, so this is sometimes called **decentralized session management**.

### What a JWT looks like

Here's Alice's token. It's three parts joined by dots, shown on three lines here so you can see them:

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.eyJzdWIiOiJ1c2VyXzQyIiwibmFtZSI6IkFsaWNlIiwiaXNzIjoiaHR0cHM6Ly9zaG9wLmV4YW1wbGUuY29tIiwiYXVkIjoic2hvcC1hcGkiLCJpYXQiOjE3OTUxOTQwMDAsImV4cCI6MTc5NTE5NzYwMH0
.ztAqcXMGO1SudJZT6qMmUos1Al88n_xwFjOzDjkQnWA
```

The first two parts are JSON, encoded with **base64url** so they're safe to put in a header or a URL. Decode them and you get:

```jsonc
// 1. Header: what kind of token this is
{ "alg": "HS256", "typ": "JWT" }

// 2. Payload: who it's about
{
  "sub": "user_42",                  // who: Alice's user ID
  "name": "Alice",
  "iss": "https://shop.example.com", // who issued it
  "aud": "shop-api",                 // who it's for
  "iat": 1795194000,                 // issued at: 20 Nov 2026, 17:00 UTC
  "exp": 1795197600                  // expires: 18:00 UTC, one hour later
}
```

The third part is the **signature**. The server makes it from the first two parts and a secret key. Change a single letter in the payload, say `user_42` to `user_1`, and the signature no longer matches, so the server rejects the token.

Four fields are worth knowing by name: `sub` (who), `iss` (who issued it), `aud` (who it's for) and `exp` (when it expires). They're defined in the [JWT standard, RFC 7519](https://www.rfc-editor.org/rfc/rfc7519).

::demo[auth-jwt-passport]

### Anyone can read a JWT

This is the part people miss. The signature stops anyone from **changing** the token. It doesn't **hide** what's inside. Paste Alice's token into [jwt.io](https://www.jwt.io/) and you'll see the JSON above, no key needed.

So never put secrets in a JWT: no passwords, no card numbers, nothing you wouldn't want the user, or someone who steals the token, to read.

(Alice's token was made with a throwaway secret, so it's safe to share here.)

### How the server checks it

The browser sends the token in a header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

"Bearer" means "whoever carries this". When a request comes in, the server:

1. **Checks the signature.** If it doesn't match, the token was changed or faked. Reject.
2. **Checks `exp`.** If that time has passed, the token has expired. Reject.
3. **Checks `iss` and `aud`.** If it came from someone else or was meant for another app, reject.
4. **Reads `sub`.** Now it knows this is Alice.

No database and no lookup. That's the whole point of a JWT.

## The Real Difference Is Who Holds the Record

Both answer the same question: "who is making this request?" They answer it from different places.

| | Session | JWT |
|---|---|---|
| Where the login lives | On the server | Inside the token |
| On every request | Server looks up the record | Server checks the signature |
| With many servers | All of them need the same session store | Each one can check the token alone |
| Logout or ban | Works immediately | Token keeps working until it expires |

The first three rows are where JWT shines. The last row is where it hurts.

### Logging out doesn't stop a JWT

Say someone copied Alice's login: from a shared laptop, a leaked log, or a bad browser extension. Then Alice logs out.

- **Session:** the server deletes the record. The copied session ID now points to nothing. The attacker is stopped.
- **JWT:** there's nothing on the server to delete. The copied token still has a valid signature and an `exp` in the future, so every server accepts it until 6 pm.

Try it. Start the clock, log Alice out, then let the attacker try the copied login:

::demo[auth-logout-race]

There are fixes. The common one is a list of blocked tokens that the server checks on every request. But look at what that is: a record on the server, checked on every request. That's a session again.

### Both are like cash

Whoever holds the session ID or the JWT is treated as Alice. The server can't tell who's actually holding it. So protect both the same way: keep them in an `HttpOnly` cookie and only send them over HTTPS. Where else you can store tokens, and the risks of each option, is a topic for Part 2.

## Which One Should You Use?

**Use sessions when:**

- you have one website with its own server. That's most apps, including the gym app I build on the side.
- you need logout, or banning a user, to work immediately.

**Use JWTs when:**

- several separate services need to check who the user is, without all sharing one session store.
- the login comes from another company's system, like "Sign in with Google". That's Part 3.

MDN gives the same advice: if you don't need the decentralized model, "it's generally better to use the centralized model".

This isn't "JWT is bad". JWT is the right tool in the right place. The mistake is reaching for it by default, giving it a long expiry, and finding out later that logout doesn't really log anyone out.

## The Problem Neither One Solves

Sessions and JWTs both expire, and choosing when is hard:

- **Short, like 15 minutes:** a stolen login stops working quickly, but Alice has to log in again and again.
- **Long, like 30 days:** Alice stays logged in, but a stolen login works for 30 days too.

With a session, the server can at least delete a stolen one, if it notices. With a JWT, it can't even do that.

So how do we keep logins short-lived without making people log in all day? That's Part 2: access tokens and refresh tokens.

Logging in is the easy part. The server still forgets you after every request. Sessions and JWTs only decide who remembers for it: the server, or the token.
