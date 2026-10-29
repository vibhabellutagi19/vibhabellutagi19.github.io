---
title: "The magic of call(), apply(), bind()"
date: "Apr 18, 2026"
excerpt: "user.greet() prints 'Hi, alice'. Pass the same function to setTimeout and it prints 'Hi, undefined'. Why this changes, and how call, apply and bind put you in control of it."
slug: "the-magic-of-call-apply-bind"
tags: "javascript, hashnode"
---

Here's a method that works:

```javascript
const user = {
  username: "alice",
  greet() {
    console.log(`Hi, ${this.username}`);
  }
};

user.greet();               // Hi, alice
setTimeout(user.greet, 0);  // Hi, undefined
```

Same function, same object. The only thing that changed is **how the function was called**, and that was enough to lose `this`.

> `this` is decided when a function is called, not where it's written. `call`, `apply` and `bind` let you decide it yourself.

This post covers how JavaScript picks `this`, then the three methods that let you set it, and how each one would fix the bug above.

## `this` Is Decided at Call Time

`this` refers to the context a function runs in. The rule that explains almost everything about it: **`this` depends on how a function is called, not where it's defined.**

- Called as a method of an object (`user.greet()`), `this` is that object.
- Called as a standalone function (`greet()`), `this` is the global object in non-strict mode, or `undefined` in strict mode.

In the example above, `setTimeout` receives only the function, not the object it came from. When it calls the function later, it's a plain call, so `this` is no longer `user`.

### `this` inside a regular function

```javascript
function showThis() {
  console.log(this);
}

showThis();
```

#### How it’s invoked

-   Called as a **plain function**: `showThis()`

#### What `this` is

-   In **non-strict mode (browser)** → `this` = `window`
-   In **strict mode** → `this` = `undefined`
-   In **Node.js** → `this` = `global` (or `undefined` in strict mode)

👉 Key point: `this` depends on **how the function is called**, not where it’s defined.

* * *

### `this` inside an object method

```javascript
const user = {
  name: "Alice",
  greet: function () {
    console.log(this.name);
  }
};

user.greet();
```

#### How it’s invoked

-   Called as a **method of the object**: `user.greet()`

#### What `this` is

-   `this` = the object before the dot → `user`
-   So `this.name` → `"Alice"`

👉 Key point: When a function is called as a **method**, `this` refers to the **owning object**.

## `call`, `apply` and `bind` Let You Choose `this`

All three do the same core thing: **let you borrow a function and control what** `this` **refers to inside it.** The difference is _how_ you pass arguments and _when_ the function runs.

* * *

#### The Setup

```js
const person = { name: "Alice" };

function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}
```

`greet` uses `this.name`, but nothing sets `this`. These three methods let us _inject_ `person` as `this`.

* * *

#### 1\. `call` — borrow & run immediately, args comma-separated

```js
greet.call(person, "Hello", "!");
// → "Hello, Alice!"
```

**Syntax:** `fn.call(thisArg, arg1, arg2, ...)`

🧠 **Mental model:** Think of it as a **phone call**: you dial (call) someone right now, and say each thing one at a time.

* * *

#### 2\. `apply` — borrow & run immediately, args as an array

```js
greet.apply(person, ["Hey", "?"]);
// → "Hey, Alice?"
```

**Syntax:** `fn.apply(thisArg, [arg1, arg2, ...])`

🧠 **Mental model:** Same as `call`, but you **apply** a whole list of arguments at once, like handing someone a _sheet of paper_ with everything on it instead of saying each thing one by one.

* * *

#### 3\. `bind` — borrow & get back a _new_ function (doesn't run yet)

```js
const greetAlice = greet.bind(person, "Hi");

// ... later ...
greetAlice("!!");
// → "Hi, Alice!!"
```

**Syntax:** `const newFn = fn.bind(thisArg, arg1, ...)`

`bind` also lets you **pre-fill** some arguments (called _partial application_).

🧠 **Mental model:** Think of `bind` as a **sticky note**: you write down who `this` is, pre-fill some args, and stick it on the function. The function doesn't run until _you_ decide to call it later.

#### Side-by-side comparison

|  | `call` | `apply` | `bind` |
| --- | --- | --- | --- |
| Runs immediately? | ✅ Yes | ✅ Yes | ❌ No — returns new fn |
| How args are passed | One by one | As an array | One by one (pre-filled) |
| Returns | Result of fn | Result of fn | A new function |

### The one-line summary for each

-   `call` → _"Run this function NOW, with this_ `this`_, passing args separately"_
-   `apply` → _"Run this function NOW, with this_ `this`_, passing args as an array"_
-   `bind` → _"Give me a new function with_ `this` _(and maybe some args) locked in — I'll call it later"_

## Back to the setTimeout Bug

`setTimeout` calls the function later, so `call` and `apply` don't fit: they run it immediately. `bind` is the one that fits, because it returns a function with `this` locked in:

```javascript
setTimeout(user.greet.bind(user), 0);  // Hi, alice
```

Whenever you hand a method to something else to call later (a timer, an event listener, a callback), the object doesn't come with it. `bind` is how you send it along.

More posts on [JavaScript](/blog/tags/javascript/).
