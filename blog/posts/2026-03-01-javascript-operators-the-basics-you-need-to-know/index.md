---
title: "JavaScript Operators: The Basics You Need to Know"
date: "Mar 1, 2026"
excerpt: "Think about the last time you used a calculator. You typed in a number, hit a button: +, -, ×, ÷ - typed another number, and got a result. Simple as that…"
slug: "javascript-operators-the-basics-you-need-to-know"
tags: "javascript"
---

Think about the last time you used a calculator. You typed in a number, hit a button: +, -, ×, ÷ - typed another number, and got a result. Simple as that.

JavaScript operators work exactly the same way. They sit between two values, do something with them, and give you back a result. The only difference? JavaScript's calculator is a lot smarter. It doesn't just do math - it compares things, makes decisions, and remembers values.

In this post, we'll use a calculator as our mental model to understand every type of operator in JavaScript. By the end, none of this will feel foreign, because it isn't.

* * *

## What Are Operators?

Pick up a basic calculator. It has two things: numbers and buttons. The numbers are your raw data. The buttons — +, -, =, % — are your **operators**.

An operator is a symbol that tells JavaScript to perform a specific action on one or more values. Those values are called **operands**. Press `5 + 3` on a calculator and you get `8`. In JavaScript, it's exactly the same:

```javascript
let result = 5 + 3;
console.log(result); // 8
```

> 🧮 **Calculator Analogy:** The numbers on the screen are your values. The buttons you press are your operators. Without the buttons, the numbers just sit there doing nothing.

* * *

## Arithmetic Operators (+, -, \*, /, %)

This is your calculator in its most basic form, standard mode. You have your four classic operations and one sneaky one that trips beginners up every time.

```javascript
let a = 10;
let b = 3;

console.log(a + b);  // 13 → addition
console.log(a - b);  // 7  → subtraction
console.log(a * b);  // 30 → multiplication
console.log(a / b);  // 3.33 → division
console.log(a % b);  // 1  → remainder
```

The first four are obvious. But `%`? Most calculators have this button and most people never touch it. Here's the secret, it doesn't give you a percentage. It gives you the leftover remainder after a division.

> 🧮 **Calculator Analogy:** Imagine dividing 10 sweets equally among 3 friends. Each gets 3 sweets. But you have **1 left over**. That leftover is exactly what `%` returns. `10 % 3 = 1`.

Modulo is surprisingly useful in real code, checking if a number is even or odd, cycling through a list, building a clock that resets to zero, and much more.

* * *

## Comparison Operators (==, ===, !=, >, <)

Now imagine your calculator has a **compare mode**. Instead of calculating a result, it looks at two values and answers one question: true or false?

Is 10 greater than 5? **True.** Is 3 equal to 7? **False.** That's exactly what comparison operators do , they always return either `true` or `false`, nothing else.

```js
console.log(10 > 5);   // true
console.log(3 < 1);    // false
console.log(5 != 3);   // true (they are NOT equal)
```

Now here's the part that confuses almost every beginner, `==` versus `===`. Two equal signs vs three.

> 🧮 **Calculator Analogy:** Imagine you type `"5"` (as text) and `5` (as a number) into two calculators. They display the same thing on screen. `==` looks at the screen and says "same!" But `===` peeks inside the machine and says "one is text, one is a number , they're NOT the same."

```javascript
console.log("5" == 5);   // true  ← dangerous!
console.log("5" === 5);  // false ← correct and safe
```

As a rule of thumb, always use `===` in your code. It checks both the value and the type, making your comparisons reliable and bug-free.

* * *

## Logical Operators (&&, ||, !)

Your calculator can now compare. But what if you need to check **two conditions at the same time**? What if one condition being true is enough? What if you want to flip a result?

That's logic mode. Logical operators combine true/false values to make bigger decisions.

> 🧮 **Calculator Analogy:** Think of a calculator that only turns on if you enter the right PIN **AND** it has battery. Both must be true. But a low-battery warning fires if the battery is low **OR** the charger is unplugged — either one triggers it. And `!` is the on/off toggle. It flips whatever state you're in.

```javascript
let hasBattery = true;
let isCharged  = false;

console.log(hasBattery && isCharged);  // false → both must be true
console.log(hasBattery || isCharged);  // true  → at least one is true
console.log(!hasBattery);              // false → flips true to false
```

A simple way to remember them:

-   `&&` — strict bouncer. **Everyone** in the group must qualify.
    
-   `||` — easy bouncer. **Anyone** qualifies, the whole group gets in.
    
-   `!` — the invert button. Flips true to false, and false to true.
    

* * *

## Assignment Operators (=, +=, -=)

Every calculator has a **memory button** , M+ to add to memory, MR to recall it. Assignment operators are JavaScript's memory system. They store values into variables and update them over time.

```javascript
let score = 0;     // store 0 in memory

score += 10;       // same as: score = score + 10 → 10
score += 5;        // same as: score = score + 5  → 15
score -= 3;        // same as: score = score - 3  → 12

console.log(score); // 12
```

> 🧮 **Calculator Analogy:** When you hit M+ on a calculator, you're not replacing what's in memory, you're **adding to it**. That running total in memory is exactly what `+=` does to a variable.

The shorthand operators aren't just lazy shortcuts — they make your code more readable and less error-prone. `score += 10` says exactly what you mean in half the characters.

* * *

## Putting It All Together

Let's write a tiny score tracker that uses every operator we've covered, just like a real calculator uses all its modes together.

```javascript
// Assignment: store starting values
let playerScore = 0;
let targetScore = 50;
let lives = 3;

// Arithmetic: calculate points for this round
let pointsEarned = 20 + 15;         // 35
let bonus = pointsEarned % 10;      // 5 (remainder)

// Assignment shorthand: update the score
playerScore += pointsEarned + bonus; // 0 + 40 = 40

// Comparison: has the player won?
let hasWon = playerScore >= targetScore; // false (40 < 50)

// Logical: game continues if not won AND has lives left
let gameContinues = !hasWon && lives > 0; // true

console.log("Score:", playerScore);      // 40
console.log("Won?", hasWon);             // false
console.log("Continue?", gameContinues); // true
```

* * *

## Wrapping Up

You've been using operators your whole life, in school, on your phone, in your head. JavaScript just gives you a more powerful set of buttons. Arithmetic crunches the numbers. Comparison checks the results. Logic makes the decision. Assignment remembers it all.

The calculator analogy holds all the way through. Once you internalise it, operators won't feel like syntax anymore, they'll feel like tools you already know how to use.
