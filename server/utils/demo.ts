const isString = (arg: unknown): arg is string => typeof arg === "string";
function numOrString(value: number | string) {
  if (isString(value)) {
    console.log(value.length);
  }
}
// arg 是个联合类型需要使用 arg is string 来确定类型，这样value.length不会报错

type Falsy = false | "" | null | undefined | 0;
const isFalsy = (val: Falsy): val is Falsy => !val;

// 索引类型查询
// key是obj的键,返回的是obj[key]的值
// function fn<T>(obj: T, key: keyof T): T[keyof T] {
//   return obj[key];
// }

// // keyof 相当于Object.keys()返回的是联合类型
// interface Obj {
//   a: number;
//   b: string;
// }
// type A = keyof Obj; // "a" | "b"

// function fn<T extends object, U extends keyof T>(obj: T, key: U): T[U] {
//   return obj[key];
// }

// function fn<T extends object, U extends keyof T>(obj: T, key: U[]): T[U][] {
//   return key.map(k => obj[k]);
// }

// interface A {
//   a: number;
//   b: string;
//   c: () => void;
// }
// type CloneA<T> = {
//   [k in keyof T]: string;
// };
// const a: CloneA<A> = {
//   a: "1",
//   b: "2",
//   c: "1",
// };

// type Naked<T> = T extends boolean ? "Y" : "N";
// type Wrapped<T> = [T] extends [boolean] ? "Y" : "N";

// type Distributed = Naked<number | boolean>;
// type NotDistributed = Wrapped<boolean | number>;
// type NotDistributed1 = Wrapped<boolean>;

// const j: Distributed = "Y";
// const k: NotDistributed = "N";
// const l: NotDistributed1 = "Y";

// // 一句话概括：没有被 [] 额外包装的联合类型参数，在条件类型进行判定时会将联合类型分发，分别进行判断。

// const foo = (): string => {
//   return "111";
// };

// type ReturnType1<T> = T extends (...arg: any[]) => infer R ? R : never;

// type FooReturnType1 = ReturnType1<typeof foo>;

// const foo2: FooReturnType1 = "1111";

interface A {
  a: string;
  b: number;
  c: boolean;
}
//
type Pick1<T, U extends keyof T> = {
  [P in U]: T[P];
};
type Part = Pick1<A, "a" | "b">;

const obj: Part = {
  a: "sss",
  b: 11,
};

type Exclude1<T, U> = T extends U ? never : T;

const obj1: Exclude1<"1" | "2" | "3" | "4" | "5", "1" | "2"> = "4";

type Omit1<T, K extends keyof any> = Pick1<T, Exclude1<keyof T, K>>;

const obj2: Omit1<A, "a" | "b"> = {
  c: false,
};
