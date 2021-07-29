let arr = [
  { id: 1, name: "部门1", pid: 0 },
  { id: 4, name: "部门4", pid: 3 },
  { id: 2, name: "部门2", pid: 1 },
  { id: 3, name: "部门3", pid: 1 },
  { id: 5, name: "部门5", pid: 4 },
];

// function arrayToTree(arrs) {
//   const result = []; // 结果
//   const dataMap = {}; //map

//   for (const item of arrs) {
//     const id = item.id;
//     const pid = item.pid;

//     if (!dataMap[id]) {
//       dataMap[id] = {
//         children: [],
//       };
//     }

//     dataMap[id] = {
//       ...item,
//       children: dataMap[id].children,
//     };

//     const treeItem = dataMap[id];

//     if (treeItem.pid === 0) {
//       result.push(treeItem);
//     } else {
//       if (!dataMap[pid]) {
//         dataMap[pid] = {
//           children: [],
//         };
//       }
//       dataMap[pid].children.push(treeItem);
//     }
//   }
//   return result;
// }
console.log("", arrayToTree(arr));

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
      children: dataMap[id].children, // 将children的指向
    };

    const treeItem = dataMap[id]; // 当前id对应值
    if (item.pid === 0) {
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

function Animal(name) {
  this.name = name;
}
Animal.color = "black";
Animal.prototype.say = function () {
  console.log("I'm " + this.name);
};
var cat = new Animal("cat");

console.log(
  cat.name, //cat
  cat.color //undefined
);
cat.say(); //I'm cat

console.log(
  Animal.name, //Animal
  Animal.color //back
);
Animal.say(); //Animal.say is not a function
