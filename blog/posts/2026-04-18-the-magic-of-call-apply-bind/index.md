---
title: "The magic of call(), apply(), bind()"
date: "Apr 18, 2026"
excerpt: "If you ever worked with javascript, you would have encountered with a famous yet confusing keyword \"this\". In this blog, we will explore how \"this\" works…"
slug: "the-magic-of-call-apply-bind"
tags: "javascript"
---

If you ever worked with javascript, you would have encountered with a famous yet confusing keyword "this". In this blog, we will explore how "this" works, and more about call(), apply() and bind() methods

### What `this` means in JavaScript

`this` keyword refers the context where a piece of code runs, might be in function's body or a object. The golden rule that explains everything about `this` depends on how a function is called, not where its defined but how its invoked.

When a regular function is invoked as a method of an object, `this` points to that object. When invoked as a standalone function (not attached to an object: `func()`), `this` typically refers to the global object (in non-strict mode) or `undefined` (in strict mode).

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

### `call`, `apply`, and `bind` in JavaScript

All three do the same core thing: **let you borrow a function and control what** `this` **refers to inside it.** The difference is _how_ and _when_ the function runs.

* * *

#### The Setup — why do we need them?

```js
const person = { name: "Alice" };

function greet(greeting, punctuation) {
  console.log(`\({greeting}, \){this.name}${punctuation}`);
}
```

`greet` uses `this.name`, but `this` isn't set. These three methods let us _inject_ `person` as `this`.

* * *

#### 1\. `call` — borrow & run immediately, args comma-separated

```js
greet.call(person, "Hello", "!");
// → "Hello, Alice!"
```

**Syntax:** `fn.call(thisArg, arg1, arg2, ...)`

🧠 **Mental model:** Think of it as a **phone call** — you dial (call) someone right now, and you pass each thing you want to say one at a time.

* * *

#### 2\. `apply` — borrow & run immediately, args as an array

```js
greet.apply(person, ["Hey", "?"]);
// → "Hey, Alice?"
```

**Syntax:** `fn.apply(thisArg, [arg1, arg2, ...])`

🧠 **Mental model:** Same as `call`, but you **apply** a whole list of arguments at once — like handing someone a _sheet of paper_ with everything on it, instead of saying each thing one by one.

* * *

#### 3\. `bind` — borrow & get back a _new_ function (doesn't run yet)

```js
const greetAlice = greet.bind(person, "Hi");

// ... later ...
greetAlice("!!");
// → "Hi, Alice!!"
```

**Syntax:** `const newFn = fn.bind(thisArg, arg1, ...)`

`bind` lets you **pre-fill** some arguments too (called _partial application_).

🧠 **Mental model:** Think of `bind` as a **sticky note** — you write down who `this` is and pre-fill some args, then stick it on the function. The function doesn't run until _you_ decide to call it later.

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
