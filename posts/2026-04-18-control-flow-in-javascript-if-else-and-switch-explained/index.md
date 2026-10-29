---
title: "Control Flow in JavaScript: If, Else, and Switch Explained"
date: "Apr 18, 2026"
excerpt: "Your bank app blocks a payment when your balance is too low. Your game says Game Over when your health hits zero. Every decision a program makes comes down to if, else and switch."
slug: "control-flow-in-javascript-if-else-and-switch-explained"
tags: "javascript"
---

Your music app skips explicit songs when parental controls are on. Your bank app blocks a payment when your balance is too low. Your favorite game says "Game Over" the moment your health hits zero.

None of these apps runs the same code every time. They check something first, then decide what to do.

> Every decision a program makes comes down to a handful of statements: `if`, `else` and `switch`.

This post covers each of them with step-by-step examples, the one `switch` mistake that causes real bugs, and a simple rule for choosing between `switch` and `if-else`.

* * *

## 1\. Code Runs Top to Bottom, Until You Branch

Imagine you're getting ready in the morning. You don't just blindly follow the same routine every day — you _make decisions_:

-   **If** it's raining, grab an umbrella.
    
-   **Otherwise**, leave it at home.
    
-   **If** you're running late, skip breakfast.
    

This is exactly what control flow means in programming. By default, JavaScript reads and executes your code **line by line, top to bottom**. But with control flow statements, you can tell JavaScript:

> _"Don't just run everything blindly — check a condition first, then decide what to do."_

Control flow lets your program **branch** into different paths based on conditions. The three main tools for this in JavaScript are:

-   `if` statements
    
-   `if-else` and `else if` ladders
    
-   `switch` statements
    

Let's explore each one.

* * *

## 2\. `if` Runs Code Only When a Condition Is True

The `if` statement is the simplest form of decision-making. It says: **"Only run this block of code IF the condition is true."**

### Syntax

```js
if (condition) {
  // code to run if condition is true
}
```

If the condition is `false`, JavaScript simply skips the block entirely and moves on.

### Real-Life Example: Checking Age for Voting

```javascript
let age = 20;

if (age >= 18) {
  console.log("You are eligible to vote.");
}

// Output: You are eligible to vote.
```

**Step-by-step walkthrough:**

1.  JavaScript reads `age >= 18`
    
2.  It checks: is `20 >= 18`? → **Yes, true**
    
3.  So it enters the block and prints the message
    

Now try with a different value:

```javascript
let age = 15;

if (age >= 18) {
  console.log("You are eligible to vote.");
}

// No output — the block is skipped
```

Since `15 >= 18` is `false`, JavaScript quietly skips the entire `if` block. Nothing happens.

### Key Takeaway

> Use `if` when you only care about what happens **when the condition is true**, and want to do nothing otherwise.

* * *

## 3\. `if-else` Always Picks One of Two Paths

What if you want to handle **both** cases — when the condition is true _and_ when it's false? That's where `else` comes in.

### Syntax

```js
if (condition) {
  // runs if condition is true
} else {
  // runs if condition is false
}
```

### Real-Life Example: Pass or Fail

```js
let marks = 45;

if (marks >= 50) {
  console.log("Result: Pass ✅");
} else {
  console.log("Result: Fail ❌");
}

// Output: Result: Fail ❌
```

**Step-by-step walkthrough:**

1.  JavaScript checks: is `45 >= 50`? → **No, false**
    
2.  It skips the `if` block
    
3.  It falls into the `else` block and prints `"Result: Fail ❌"`
    

Only **one** of the two blocks will ever run — never both.

### Key Takeaway

> Use `if-else` when there are exactly **two possible outcomes** — the condition is either true or false.

* * *

## 4\. `else if` Checks Conditions Top to Bottom and Stops at the First Match

Real life rarely gives us just two choices. What if you need to check **multiple conditions** in sequence? That's where `else if` comes in — it lets you build a **ladder** of conditions.

### Syntax

```js
if (condition1) {
  // runs if condition1 is true
} else if (condition2) {
  // runs if condition2 is true
} else if (condition3) {
  // runs if condition3 is true
} else {
  // runs if none of the above are true
}
```

JavaScript checks each condition **from top to bottom** and stops as soon as it finds one that's true.

### Real-Life Example: Grade Calculator

```js
let marks = 72;

if (marks >= 90) {
  console.log("Grade: A");
} else if (marks >= 75) {
  console.log("Grade: B");
} else if (marks >= 60) {
  console.log("Grade: C");
} else if (marks >= 40) {
  console.log("Grade: D");
} else {
  console.log("Grade: F — Please retake the exam");
}

// Output: Grade: C
```

**Step-by-step walkthrough:**

1.  Is `72 >= 90`? → No. Move on.
    
2.  Is `72 >= 75`? → No. Move on.
    
3.  Is `72 >= 60`? → **Yes!** → Print `"Grade: C"` and **stop**.
    

JavaScript never even checks the `>= 40` condition because it already found a match.

Order matters: put `marks >= 40` first and every passing student gets a D, because it matches before the higher grades are ever checked.

### Key Takeaway

> Use `else if` when you have **3 or more possible outcomes** that depend on a single variable being checked against different ranges or values.

* * *

## 5\. `switch` Matches One Value Against Many

The `switch` statement is a cleaner alternative when you're comparing **one variable against many specific values**. Instead of writing a long chain of `else if`, `switch` lays all the options out neatly.

### Syntax

```js
switch (expression) {
  case value1:
    // code for value1
    break;
  case value2:
    // code for value2
    break;
  case value3:
    // code for value3
    break;
  default:
    // code if no case matches
}
```

### Real-Life Example: Day of the Week

```js
let day = 3;

switch (day) {
  case 1:
    console.log("Monday");
    break;
  case 2:
    console.log("Tuesday");
    break;
  case 3:
    console.log("Wednesday");
    break;
  case 4:
    console.log("Thursday");
    break;
  case 5:
    console.log("Friday");
    break;
  case 6:
    console.log("Saturday");
    break;
  case 7:
    console.log("Sunday");
    break;
  default:
    console.log("Invalid day number");
}

// Output: Wednesday
```

**Step-by-step walkthrough:**

1.  JavaScript evaluates `day` → it's `3`
    
2.  It checks `case 1` → not a match
    
3.  It checks `case 2` → not a match
    
4.  It checks `case 3` → **match!** → prints `"Wednesday"`
    
5.  It hits `break` → exits the switch block immediately
    

### 🔴 Forget `break` and Every Case Below Runs Too

The `break` keyword tells JavaScript: **"You're done. Exit the switch now."**

What happens if you forget it? JavaScript will **fall through** — it keeps running every case below the matched one, even if they don't match. This is called **fallthrough behavior** and is a common source of bugs.

```javascript
let day = 3;

switch (day) {
  case 3:
    console.log("Wednesday");
    // ⚠️ No break here!
  case 4:
    console.log("Thursday");
    // ⚠️ No break here!
  case 5:
    console.log("Friday");
    break;
}

// Output:
// Wednesday
// Thursday
// Friday
```

Even though `day` is `3`, all three cases ran because there was no `break` to stop the flow. **Always add** `break` unless you deliberately want fallthrough.

### Using Fallthrough Intentionally

Sometimes fallthrough is actually useful — when multiple cases should share the same outcome:

```js
let day = "Saturday";

switch (day) {
  case "Saturday":
  case "Sunday":
    console.log("It's the weekend! 🎉");
    break;
  case "Monday":
  case "Tuesday":
  case "Wednesday":
  case "Thursday":
  case "Friday":
    console.log("It's a weekday. 💼");
    break;
  default:
    console.log("Unknown day");
}

// Output: It's the weekend! 🎉
```

Here, both `"Saturday"` and `"Sunday"` fall through to the same `console.log` — this is clean, intentional, and readable.

### The `default` Case

`default` is like the `else` in an `if-else` — it runs when **no case matches**. It's optional, but always a good idea to include it.

```js
let trafficLight = "purple";

switch (trafficLight) {
  case "red":
    console.log("Stop 🔴");
    break;
  case "yellow":
    console.log("Slow down 🟡");
    break;
  case "green":
    console.log("Go! 🟢");
    break;
  default:
    console.log("Unknown signal — proceed with caution");
}

// Output: Unknown signal — proceed with caution
```

### Key Takeaway

> Use `switch` when you're matching **one variable** against **multiple exact values**, and each case has a distinct action. Always use `break` unless you intentionally want fallthrough.

* * *

## 6\. When to Use `switch` vs `if-else`

This is one of the most common questions beginners ask. Here's a clear breakdown:

| Scenario | Best Choice |
| --- | --- |
| Checking a range of values (`>= 60`, `< 100`) | `if-else` |
| Checking complex conditions (`age > 18 && hasID`) | `if-else` |
| Matching one variable to many exact values | `switch` |
| Two possible outcomes | `if-else` |
| Many named cases (days, months, menu options) | `switch` |
| Conditions involve different variables | `if-else` |

### Side-by-Side Comparison

Here's the same logic written both ways — you decide which is cleaner:

**Using** `if-else`**:**

```js
let fruit = "mango";

if (fruit === "apple") {
  console.log("🍎 Apple selected");
} else if (fruit === "banana") {
  console.log("🍌 Banana selected");
} else if (fruit === "mango") {
  console.log("🥭 Mango selected");
} else {
  console.log("Unknown fruit");
}
```

**Using** `switch`**:**

```js
let fruit = "mango";

switch (fruit) {
  case "apple":
    console.log("🍎 Apple selected");
    break;
  case "banana":
    console.log("🍌 Banana selected");
    break;
  case "mango":
    console.log("🥭 Mango selected");
    break;
  default:
    console.log("Unknown fruit");
}
```

Both produce the same output. But when you have 10+ specific values to check, `switch` wins on readability every time.

### The Golden Rule

-   If your conditions involve **ranges, inequalities, or multiple variables** → use `if-else`
    
-   If you're matching **one thing to a list of exact values** → use `switch`
    

* * *

## Putting It All Together

Here's a mini program that uses everything you've learned:

```js
let studentMarks = 68;
let studentAge = 17;

// else if ladder: school stage by age
if (studentAge < 5) {
  console.log("Too young for school.");
} else if (studentAge < 18) {
  console.log("School-going student.");
} else {
  console.log("Adult learner.");
}

// else if ladder: marks are a range, so if-else picks the grade
let grade;

if (studentMarks >= 90) {
  grade = "A";
} else if (studentMarks >= 75) {
  grade = "B";
} else if (studentMarks >= 60) {
  grade = "C";
} else {
  grade = "F";
}

// switch: the grade is one exact value, so switch picks the message
switch (grade) {
  case "A":
    console.log("Outstanding performance! 🌟");
    break;
  case "B":
    console.log("Great job! Keep it up. 👍");
    break;
  case "C":
    console.log("Good effort. Room to improve. 📈");
    break;
  default:
    console.log("Needs significant improvement. 📚");
}

// Output:
// School-going student.
// Good effort. Room to improve. 📈
```

* * *

## Summary

Here's everything you covered in one quick reference:

| Statement | Purpose |
| --- | --- |
| `if` | Run code only when condition is true |
| `if-else` | Handle true/false — two outcomes |
| `else if` | Handle multiple conditions in order |
| `switch` | Match one value against many exact cases |
| `break` | Exit the switch block after a match |
| `default` | Fallback if no case matches |

The music app, the bank app and the game from the start of this post all work this way. Under the features, each one is a stack of these checks: is the balance high enough, is health above zero, is this song allowed. Learn to read `if`, `else` and `switch`, and you can read how any program makes up its mind.

More posts on [JavaScript](/blog/tags/javascript/).
