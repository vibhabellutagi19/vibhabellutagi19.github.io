---
title: "Global vs GlobalThis"
date: "Mar 8, 2026"
excerpt: "window.myVar works in the browser. Run the same file in Node.js and it crashes: window is not defined. Same language, same global object, different names, and the one name that works everywhere."
slug: "global-vs-globalthis"
tags: "javascript, hashnode"
---

Write `window.myVar = 1` and it works in the browser. Run the same file in Node.js and it crashes:

```
ReferenceError: window is not defined
```

Same language. Same idea of a global object. A different name.

> `globalThis` is the one name for the global object that works in every JavaScript environment.

This post covers what the global object is, why it ended up with a different name in each environment, how `globalThis` fixes that, and why you should still use it sparingly.

:::tldr
**Problem:** the global object is called `window` in browsers, `global` in Node.js and `self` in Web Workers, so code that touches it breaks when it runs somewhere else.

**Fix:** use `globalThis` (ES2020), which works everywhere. But prefer module exports over globals: reach for `globalThis` only when something truly must be global.
:::

## Global Variables Live on an Object

Scope answers one question:

> Where in your code can this variable be seen and used?

A variable declared inside a function or a `{ }` block is only visible there. A variable at the top level is visible everywhere:

```javascript
let globalVar = 'This is global variable';

function localScope() {
  let localVar = 'This is local variable';

  console.log('Inside function: ', localVar);  // ✅ This is local variable
  console.log('Inside function: ', globalVar); // ✅ This is global variable
}

localScope();

console.log('Outside function: ', globalVar); // ✅ This is global variable
console.log('Outside function: ', localVar);  // ❌ ReferenceError: localVar is not defined
```

But what does "everywhere" actually mean? JavaScript always has a container that holds the things available everywhere: built-ins like `setTimeout`, `fetch` and `console`, plus anything you attach to it yourself. That container is the **global object**.

Every JavaScript environment has one, but each environment named it differently:

| Environment | Global Object |
| --- | --- |
| Browser | `window` |
| Node.js | `global` |
| Web Workers (browser background threads) | `self` |

## Three Names for One Object

The global object means the same thing in every environment, but it goes by a different name in each one. To write code that worked everywhere, such as a library used in both the browser and Node.js, developers had to detect which environment they were in:

```javascript
function getGlobalObject() {
  if (typeof window !== 'undefined') return window;   // Browser
  if (typeof global !== 'undefined') return global;   // Node.js
  if (typeof self !== 'undefined') return self;       // Web Workers
  throw new Error('Unable to locate global object');  // Unknown environment
}

const globalObj = getGlobalObject();
```

This approach was error-prone. Some versions added a last-resort fallback of `this`, which only works in non-strict scripts: in strict mode and in ES modules, top-level `this` is `undefined`, so the fallback silently breaks. It was too much boilerplate just to do one simple thing, access the global object.

## globalThis Is the Name That Works Everywhere

`globalThis`, introduced in ES2020, makes that function unnecessary. It's a single, standard name for the global object, with no environment checks and no fragile fallbacks.

```javascript
// ❌ Before — environment detection
const globalObj = getGlobalObject();
globalObj.myVar = 42;

// ✅ After — works in browsers, Node.js and Web Workers
globalThis.myVar = 42;
console.log(globalThis.myVar); // 42
```

**Benefits of** `globalThis`**:**

1.  **Available everywhere** - built into every modern JavaScript environment. No imports, no setup.
2.  **Simpler code** - one consistent reference instead of a detection function.
3.  **Readable** - any developer immediately knows what `globalThis` refers to.

A common use is checking whether a feature exists, without caring where the code runs:

```javascript
if (typeof globalThis.fetch !== 'undefined') {
  console.log('fetch is supported');
} else {
  console.log('fetch is not supported');
}
```

## Use It Rarely, Because Globals Are Shared by Everyone

`globalThis` makes the global object easy to reach. That doesn't make globals a good idea.

> Use `globalThis` only when something genuinely needs to be reachable from your entire program, across different environments.

**Good use cases:**

-   Writing a library or utility that runs in both the browser and Node.js
-   Feature detection across environments
-   Polyfilling missing features

**Avoid it when:**

-   A regular variable or module export would do the job
-   You're tempted to use it just to avoid passing data around properly

### ⚠️ Don't Pollute the Global Scope

Every property you add to `globalThis` is visible to every file in your program, including third-party code:

```javascript
// ❌ Bad — polluting the global scope
globalThis.username = 'Alice';
globalThis.fetchData = function() { ... };
globalThis.config = { debug: true };

// ✅ Good — keep things scoped with modules
export const username = 'Alice';
export function fetchData() { ... }
export const config = { debug: true };
```

Polluting globals leads to:

-   **Name collisions**: two files accidentally overwrite each other's variables
-   **Harder debugging**: values change from places you didn't expect
-   **Unpredictable code**: any file can depend on anything

## global vs globalThis

|  | `global` | `globalThis` |
| --- | --- | --- |
| Introduced | Node.js (early) | ES2020 |
| Works in Browser | ❌ | ✅ |
| Works in Node.js | ✅ | ✅ |
| Works in Web Workers | ❌ | ✅ |
| Standardised | ❌ Node-specific | ✅ Official JS standard |
| Recommended | Only for Node.js specific code | Always preferred |

---

So when code needs to reach the global object, don't ask which environment you're in. Write `globalThis`, and then ask whether it should be global at all.

More posts on [JavaScript](/blog/tags/javascript/).
