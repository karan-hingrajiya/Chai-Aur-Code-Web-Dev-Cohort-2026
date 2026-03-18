# 🚀 Custom Promise Implementation (From Scratch)

This project demonstrates a **from-scratch implementation of JavaScript Promises**, including a **custom microtask queue and event loop simulation**.

The goal of this project is to deeply understand how JavaScript handles:

* Asynchronous execution
* Microtask queues
* Promise chaining (`then`, `catch`)
* Event loop behavior

---

## 📌 What I Built

Instead of relying on the built-in `Promise`, I created:

* ✅ A custom `Mypromise` class
* ✅ A manual **microtask queue**
* ✅ A simulated **event loop**
* ✅ Support for:

  * `.then()`
  * `.catch()` (named `mycatch`)
  * Promise chaining
  * Error propagation

---

## 🧠 Core Concepts Covered

This implementation helps understand:

* **How Promises work internally**
* **How microtasks are queued and executed**
* **Why `.then()` is always asynchronous**
* **How chaining works under the hood**
* **How errors propagate across `.then()` and `.catch()`**

---

## ⚙️ Architecture Overview

### 1. Queue (Microtask Queue)

I implemented a queue using an object for **O(1)** operations:

```js
class Queue {
  constructor() {
    this.items = {};
    this.headIndex = 0;
    this.tailIndex = 0;
  }
}
```

* Acts as a **microtask queue**
* Stores callbacks from `.then()` and `.catch()`
* Ensures FIFO execution

---

### 2. Custom Promise (`Mypromise`)

Each promise maintains:

```js
this.state = "pending";
this.value = undefined;
this.fulfillArr = [];
this.rejectArr = [];
```

#### States:

* `pending`
* `fulfilled`
* `rejected`

---

### 3. Resolve & Reject

```js
function resolve(val) { ... }
function reject(msg) { ... }
```

What happens:

* State changes
* Stored callbacks are pushed into the **microtask queue**
* Execution is deferred (just like real Promises)

---

### 4. then() Implementation

```js
Mypromise.prototype.then = function (callbackFunc) { ... }
```

Key behaviors:

* Returns a **new Promise** (for chaining)
* Stores callbacks if pending
* Executes via microtask queue if already settled
* Handles errors using `try/catch`

---

### 5. catch() Implementation

```js
Mypromise.prototype.mycatch = function (callbackFunc) { ... }
```

Important detail:

* Converts rejected → fulfilled after handling error
* Ensures next `.then()` continues correctly

---

### 6. Event Loop Simulation

```js
function eventLoop() {
  setInterval(() => {
    darainMicroTaskQueue();
  }, 0);
}
```

Why?

* JavaScript engines continuously process microtasks
* `setInterval` simulates that behavior
* Stops automatically when:

  * No pending promises
  * Queue is empty

---

## 🔁 Flow of Execution

1. Promise is created → state = `pending`
2. `resolve()` / `reject()` is called (possibly async)
3. Callbacks are pushed into **microtask queue**
4. Event loop continuously:

   * Drains the queue
   * Executes callbacks
5. `.then()` / `.catch()` chain continues

---

## 🧪 Example

```js
const myOwnPromise = new Mypromise(func);

myOwnPromise
  .then((res) => {
    console.log("p1:", res);
    return res;
  })
  .then((val) => {
    console.log("p2:", val);
    return "chai aur code";
  })
  .mycatch((err) => {
    console.log("caught:", err.message);
  })
  .then((val) => {
    console.log("after catch:", val);
  });

eventLoop();
```

---

## ⚠️ Key Learnings

* Promises are not magic — they rely on:

  * State management
  * Callback queues
  * Event loop scheduling

* `.then()`:

  * Always returns a new Promise
  * Always runs asynchronously

* `.catch()`:

  * Recovers from errors
  * Converts rejection → fulfillment (if handled)

---

## ❗ Limitations (Compared to Native Promises)

This is a learning implementation, so it does NOT include:

* ❌ Full Promise/A+ compliance
* ❌ `finally()`
* ❌ Thenable resolution (nested promises)
* ❌ Proper microtask prioritization vs macrotasks
* ❌ Browser/Node internal optimizations

---

## 💡 Why I Built This

As a developer, I wanted to:

* Go beyond surface-level understanding
* Learn how async behavior works internally
* Simulate the JavaScript runtime behavior

This project helped me understand **what actually happens behind `.then()` and `.catch()`**.


## 📎 Conclusion

This project is a deep dive into **JavaScript internals** — especially how asynchronous code is executed.


