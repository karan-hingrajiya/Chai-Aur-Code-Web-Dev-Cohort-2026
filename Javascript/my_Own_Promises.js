class Queue {
  constructor() {
    this.items = {}; // Using an object for O(1) performance
    this.headIndex = 0;
    this.tailIndex = 0;
  }

  enqueue(callbk, val) {
    this.items[this.tailIndex] = { callbk, val }; //now event loop can add to stack and run this if want to.
    this.tailIndex++;
  }

  dequeue() {
    if (this.isEmpty()) {
      return "Underflow";
    }
    const element = this.items[this.headIndex];
    delete this.items[this.headIndex];
    this.headIndex++;
    return element;
  }

  isEmpty() {
    return this.tailIndex === this.headIndex;
  }
}

const microtaskQueue = new Queue();
let pendingCount = 0; //for counting that promises still exist if it is then we cant clearinterval() we need to celarinterval bcz it's darining CPU even after there is no promises left to handle.
function Mypromise(callbk) {
  //inside this promise we .prototype property so we can have resolve() and resject inside it right

  this.state = "pending";
  this.value = undefined;
  this.fulfillArr = [];
  this.rejectArr = [];

  pendingCount++;
  //capture the instance here
  const self = this;

  function resolve(val) {
    if (self.state !== "pending") {
      return;
    }
    self.state = "fulfilled";
    self.value = val;

    for (let callback of self.fulfillArr) {
      microtaskQueue.enqueue(callback, val);
    }
    pendingCount--;
  }

  function reject(msg) {
    //reject logic
    if (self.state !== "pending") return;
    self.state = "rejected";
    self.value = msg;
    for (let callback of self.rejectArr) {
      microtaskQueue.enqueue(callback, msg);
    }
    pendingCount--;
  }

  callbk(resolve, reject);
}

Mypromise.prototype.then = function (callbackFunc) {
  return new Mypromise((resolve, reject) => {
    function handle(val) {
      try {
        let callBackValue = callbackFunc(val);
        resolve(callBackValue);
      } catch (err) {
        reject(err); // reject the new Promise — error travels down chain
      }
    }

    function handleRejection(err) {
      reject(err); // just pass the error to the next Promise
    }
    if (this.state === "pending") {
      this.fulfillArr.push(handle);
      this.rejectArr.push(handleRejection);
    } else if (this.state === "fulfilled") {
      microtaskQueue.enqueue(handle, this.value);
    } else if (this.state === "rejected") {
      microtaskQueue.enqueue(handleRejection, this.value);
    }
  });
};

Mypromise.prototype.mycatch = function (callbackFunc) {
  return new Mypromise((resolve, reject) => {
    function handle(val) {
      try {
        let callBackValue = callbackFunc(val);
        resolve(callBackValue);
        //resolve here because we dont know if there is .then() after the .catch() handler so we need to be state fulfill so that our next then can fullfill its result if we do reject state then our next then() fails without any reason even though we catch the error in currnt catch().
      } catch (err) {
        reject(err);
      }
    }

    if (this.state === "pending") {
      this.rejectArr.push(handle);
      this.fulfillArr.push((val) => resolve(val));
    } else if (this.state === "rejected") {
      microtaskQueue.enqueue(handle, this.value);
    } else if (this.state === "fulfilled") {
      // Promise was fulfilled — .catch() doesn't run
      // but we still need to forward the fulfilled value
      // so the next .then() after .catch() works
      resolve(this.value);
    }
  });
};

function darainMicroTaskQueue() {
  while (!microtaskQueue.isEmpty()) {
    const { callbk, val } = microtaskQueue.dequeue();
    callbk(val);
  }
}
const eventLoop = function () {
  //each event tick it runs and if there is timerfunction in between it push to the stack in v8.
  let intervalId = setInterval(() => {
    darainMicroTaskQueue();

    // stop when no pending Promises AND queue is empty
    // means all async work is genuinely finished
    if (microtaskQueue.isEmpty() && pendingCount === 0) {
      clearInterval(intervalId);
    }
  }, 0);
};

function func(res, rej) {
  let num = 0;
  if (num > 4) {
    setTimeout(() => {
      res("karan");
    }, 1000);
  } else {
    rej("some error");
  }
}

function func(res, rej) {
  let num = 20;
  if (num > 4) {
    setTimeout(() => res("karan"), 1000);
  } else {
    setTimeout(() => {
      let err = new Error("num is too small");
      rej(err); // ← rejects after 1000ms
    }, 1000);
  }
}

const myOwnPromise = new Mypromise(func);

let p1 = myOwnPromise.then((res) => {
  console.log("p1 then ran:", res); // should NOT run
  return res;
});

let p2 = p1.then((val) => {
  console.log("p2 then ran:", val); // should NOT run
  return "chai aur code";
});

let p3 = p2.mycatch((err) => {
  console.log("caught:", err.message); // SHOULD not run 
});

let p4 = p3.then((val) => {
  console.log("p4 after catch:", val); // SHOULD run with "chai aur code"
});

eventLoop();

// darainMicroTaskQueue();  it will not work because in sync call it will work only for once we need continues looking if the promise is pending or not in event loop.
