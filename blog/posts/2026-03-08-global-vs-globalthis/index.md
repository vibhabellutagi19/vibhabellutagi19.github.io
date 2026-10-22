---
title: "Global vs GlobalThis"
date: "Mar 8, 2026"
excerpt: "Learn the difference between global and globalThis in JavaScript. Understand the global object, why it has different names across environments, and ho"
slug: "global-vs-globalthis"
tags: "javascript"
---

**TL;DR**

Every JavaScript environment has a global object, but it has different names:

1.  `window` in browsers
    
2.  `global` in Node.js,
    
3.  and `self` in Web Workers.
    

This forced developers to write messy environment-detection code just to access it reliably. `globalThis`, introduced in ES2020, solves this by providing one universal name that works everywhere. Use it when you need cross-environment compatibility - but use it sparingly, as polluting the global scope leads to bugs and messy code.

## What is scope?

Almost every modern programming language has the concept of scope, and JavaScript is no exception. At its core, scope answers simple question:

❔

Where in your code can this variable be seen and used?

Think of a code which has 10000 lines, if a variable defined once, is accessible throughout the huge code, is it a good practice?  
The scope here sets the boundary of the variables - when you create a variable, it's not always everywhere, scope defines the boundaries of where that variable lives and who can access it.

#### Global & Function Scope

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

Global Scope - visible _everywhere_ in your code  
Function Scope - visible only inside that function

#### Block Scope

Block Scope - visible only _inside that block_ `{ }`

```javascript
let localFlag = true;

if (localFlag) {
  let blockVar = 'This is in if block';
  console.log('Inside block: ', blockVar); // ✅ This is in if block
}

console.log('Outside block: ', blockVar); // ❌ ReferenceError: blockVar is not defined
```

## What is the Global Object?

We just saw that variables declared outside any function are accessible everywhere. But have you ever wondered what 'everywhere' actually means in JavaScript? There's a container that holds all of these global variables, and it's called the global object.

In each JavaScript environment, there's always a global object defined. The context of global's interface depends on the execution context in which the script is running -

| Enviornment | Global Object |  |
| --- | --- | --- |
| Browser | Window |  |
| Node.js | global |  |
| Web Workers | self | browser background threads |

## The Problem: global, window, self

The real problem is this: the global object means the same thing in every JavaScript environment, but it goes by a different name in each one. To write code that worked everywhere, developers either required to write environment specific code or had to manually check which environment they were in:

```javascript
function getGlobalObject() {
  if (typeof window !== 'undefined') return window;   // Browser
  if (typeof global !== 'undefined') return global;   // Node.js
  if (typeof self !== 'undefined') return self;       // Web Workers
  throw new Error('Unable to locate global object');  // Unknown environment
}

const globalObj = getGlobalObject();
```

This approach was error-prone. In strict mode, `this` is `undefined` instead of the global object, silently breaking the fallback. It was too much boilerplate just to do one simple thing , access the global object.

## What is globalThis and what problem does it solve?

Remember that function we just wrote to detect the environment? `globalThis` makes it completely unnecessary. Introduced in ES2020, it gives JavaScript a single standardised way to access the global object, no environment checks, no fragile fallbacks. It just works, everywhere.

**Benefits of** `globalThis`**:**

1.  **Easy Access** - Available out of the box in every JavaScript environment. No imports, no setup, no configuration needed.
    
2.  **Simplified Code** - Replaces lengthy environment detection code with a single, consistent reference. What used to take 5 lines now takes one.
    
3.  **Maintainable Code** - Any developer, regardless of their background, immediately understands what `globalThis` refers to. No guessing, no environment-specific surprises.
    

## How to Use globalThis?

**Setting a global variable**

```javascript
globalThis.myVar = 'Hello World';
console.log(globalThis.myVar); // Hello World
```

**Sharing data across modules**

```javascript
// module-a.js
globalThis.config = { debug: true, version: '1.0.0' };

// module-b.js
console.log(globalThis.config.version); // 1.0.0
```

**Checking if a feature exists**

```javascript
if (typeof globalThis.fetch !== 'undefined') {
  console.log('fetch is supported');
} else {
  console.log('fetch is not supported');
}
```

#### Comparing with global

```javascript
// ❌ Before — complicated environment detection
function getGlobalObject() {
  if (typeof window !== 'undefined') return window;   // Browser
  if (typeof global !== 'undefined') return global;   // Node.js
  if (typeof self !== 'undefined') return self;       // Web Workers
  throw new Error('Unable to locate global object');  // Unknown environment
}

const globalObj = getGlobalObject();
globalObj.myVar = 42;
console.log(globalObj.myVar); // 42

// ✅ After — simple and universal
globalThis.myVar = 42;
console.log(globalThis.myVar); // 42
```

## When should you use it? (+ avoid polluting globals)

`globalThis` is powerful, but that doesn't mean you should reach for it often. Here's a simple rule:

> Use `globalThis` only when you genuinely need something to be accessible across your entire application and across different environments.

**Good use cases:**

-   Writing a library or utility that runs in both browser and Node.js
    
-   Feature detection across environments
    
-   Polyfilling missing features
    
-   Sharing configuration across modules
    

**Avoid it when:**

-   A regular variable or module export would do the job
    
-   You're tempted to use it just to avoid passing data around properly
    

* * *

### ⚠️ Don't Pollute the Global Scope

Every property you add to `globalThis` is available everywhere in your entire program. This sounds convenient but causes real problems:

javascript

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

-   **Name collisions** : two files accidentally overwrite each other's variables
    
-   **Harder debugging** : variables change from unexpected places
    
-   **Messy codebase** : nothing is predictable
    

## global vs globalThis

|  | `global` | `globalThis` |
| --- | --- | --- |
| Introduced | Node.js (early) | ES2020 |
| Works in Browser | ❌ | ✅ |
| Works in Node.js | ✅ | ✅ |
| Works in Web Workers | ❌ | ✅ |
| Standardised | ❌ Node-specific | ✅ Official JS standard |
| Recommended | Only for Node.js specific code | Always preferred |

### Wrap up

If you learnt something new about the global and globalThis concept in Javascript, share it with your friends and teammates :) Follow me for more content
