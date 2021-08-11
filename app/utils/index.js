let arr = [
  { id: 1, name: "部门1", pid: 0 },
  { id: 4, name: "部门4", pid: 3 },
  { id: 2, name: "部门2", pid: 1 },
  { id: 3, name: "部门3", pid: 1 },
  { id: 5, name: "部门5", pid: 4 },
];

function arrayToTree(arrs) {
  const result = [];
  const dataMap = {};
  for (const item of arrs) {
    const id = item.id;
    const pid = item.pid;

    if (!dataMap[id]) {
      dataMap[id] = {
        children: [],
      };
    }

    dataMap[id] = {
      ...item,
      children: dataMap[id].children,
    };
    const treeItem = dataMap[id];
    if (pid === 0) {
      result.push(treeItem);
    } else {
      if (!dataMap[pid]) {
        dataMap[pid] = {
          children: [],
        };
      }
      dataMap[pid].children.push(treeItem);
    }
  }
  return result;
}

console.log("", arrayToTree(arr));

// 寄生组合式继承

function inheriterObject(b) {
  function F() {}
  F.prototype = b;
  return new F();
}

function inheriterPrototype(subClass, superClass) {
  const p = inheriterObject(superClass.prototype);
  p.constructor = subClass;
  subClass.prototype = p;
}
function SuperType(name) {
  this.name = name;
  this.colors = ["red", "yellow", "bule"];
}
SuperType.prototype.sayName = function () {
  console.log(this.name);
};
function SubType(name, age) {
  SuperType.call(this, name);
  this.age = age;
}

inheriterPrototype(SubType, SuperType);

SubType.prototype.sayAge = function () {
  console.log(this.age);
};

let instancel = new SubType("jackson", 22);
instancel.colors.push("pink");
instancel.sayName(); // "jackson"
instancel.sayAge(); //22
console.log(instancel.colors); // ["red", "yellow", "bule", "pink"]

let instance2 = new SubType("bear", 20);
console.log(instance2.colors); // ["red", "yellow", "bule"]
instance2.sayName(); // "bear";
instance2.sayAge(); // 20
