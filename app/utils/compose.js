const composePromise = (...args) => {
  const init = args.pop();
  return (...arg) => {
    return args.reverse().reduce((sequence, func) => {
      console.log("sequence", sequence);
      return sequence
        .then(
          result => {
            return func.call(null, {
              code: 200,
              data: result,
            });
          },
          result => {
            return func.call(null, {
              code: 404,
              data: result,
            });
          }
        )
        .catch(err => {
          console.log("err", err);
        });
    }, Promise.resolve(init.apply(null, arg)));
  };
};

const a = res => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("xhr1", res);
      resolve("xhr1");
    }, 3000);
  });
};

const b = res => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("xhr2", res);
      reject("xhr2");
    }, 3000);
  });
};

const c = res => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("xhr3", res);
      resolve("xhr3");
    }, 3000);
  });
};

const d = () => {
  console.log("sssss");
  return "xhr4";
};

const err = res => {
  return new Promise(() => {
    console.log("res", res);
    throw new Error("出错了").stack;
  });
};

window.addEventListener("unhandledrejection", e => {
  e.preventDefault();
  console.log("捕获到异常", e);
  return true;
});

const arr = [a, b, err, d, c];

const result = composePromise(...arr);

result("init").then(() => {
  console.log("down");
});

var a = {
  i: 1,
  toString() {
    return a.i++;
  },
};
if (a == 1 && a == 2 && a == 3) {
  console.log(1);
}
let a = [1, 2, 3];
a.toString = a.shift;
if (a == 1 && a == 2 && a == 3) {
  console.log(1);
}

var obj = {
  2: 3,
  3: 4,
  length: 2,
  splice: Array.prototype.splice,
  push: Array.prototype.push,
};
obj.push(1);
obj.push(2);
console.log(obj);
