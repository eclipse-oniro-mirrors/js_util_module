/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let flag = false;
let fastList = undefined;
let arkPritvate = globalThis["ArkPrivate"] || undefined;
if (arkPritvate !== undefined) {
  fastList = arkPritvate.Load(arkPritvate.List);
} else {
  flag = true;
}
if (flag || fastList == undefined) {
  class HandlerList<T> {
    get(obj: List<T>, prop: any) {
      if (typeof prop === "symbol") {
        return obj[prop];
      }
      let index = Number.parseInt(prop);
      if (Number.isInteger(index)) {
        if (index < 0 || index >= obj.length) {
          throw new RangeError("the index is out-of-bounds");
        }
        return obj.get(index);
      }
      return obj[prop];
    }
    set(obj: List<T>, prop: any, value: T) {
      if (prop === "elementNum" ||
        prop === "capacity" ||
        prop === "head" ||
        prop == "next") {
        obj[prop] = value;
        return true;
      }
      let index = Number.parseInt(prop);
      if (Number.isInteger(index)) {
        if (index < 0 || index >= obj.length) {
          throw new RangeError("the index is out-of-bounds");
        } else {
          obj.set(index, value);
          return true;
        }
      }
      return false;
    }
    deleteProperty(obj: List<T>, prop: any) {
      let index = Number.parseInt(prop);
      if (Number.isInteger(index)) {
        if (index < 0 || index >= obj.length) {
          throw new RangeError("the index is out-of-bounds");
        }
        obj.removeByIndex(index);
        return true;
      }
      return false;
    }
    has(obj: List<T>, prop: any) {
      return obj.has(prop);
    }
    ownKeys(obj: List<T>) {
      let keys = [];
      for (let i = 0; i < obj.length; i++) {
        keys.push(i.toString());
      }
      return keys;
    }
    defineProperty(obj: List<T>, prop: any, desc: any) {
      return true;
    }
    getOwnPropertyDescriptor(obj: List<T>, prop: any) {
      let index = Number.parseInt(prop);
      if (Number.isInteger(index)) {
        if (index < 0 || index >= obj.length) {
          throw new RangeError("the index is out-of-bounds");
        }
        return Object.getOwnPropertyDescriptor(obj, prop);
      }
      return;
    }
    setPrototypeOf(obj: any, prop: any): any {
      throw new Error("Can setPrototype on List Object");
    }
  }
  interface IterableIterator<T> {
    next: () => {
      value: T;
      done: boolean;
    };
  }
  class NodeObj<T> {
    element: T;
    next?: NodeObj<T>;
    constructor(element: T, next?: NodeObj<T>) {
      this.element = element;
      this.next = next;
    }
  }
  class List<T> {
    private head: NodeObj<T>;
    private elementNum: number;
    private capacity: number;
    private next?: NodeObj<T>;
    constructor() {
      this.head = undefined;
      this.next = undefined;
      this.elementNum = 0;
      this.capacity = 10;
      return new Proxy(this, new HandlerList());
    }
    get length() {
      return this.elementNum;
    }
    private getNode(index: number): NodeObj<T> | undefined {
      if (index >= 0 && index < this.elementNum) {
        let current = this.head;
        for (let i = 0; i < index; i++) {
          if (current !== undefined) {
            current = current.next;
          }
        }
        return current;
      }
      return undefined;
    }
    get(index: number): T {
      if (index >= 0 && index < this.elementNum) {
        let current = this.head;
        for (let i = 0; i < index && current != undefined; i++) {
          current = current.next;
        }
        return current.element;
      }
      return undefined;
    }
    add(element: T): boolean {
      let node = new NodeObj(element);
      if (this.head == undefined) {
        this.head = node;
      } else {
        let current = this.head;
        while (current.next !== undefined) {
          current = current.next;
        }
        current.next = node;
      }
      this.elementNum++;
      return true;
    }
    clear(): void {
      this.head = undefined;
      this.elementNum = 0;
    }
    has(element: T): boolean {
      if (this.head !== undefined) {
        if (this.head.element === element) {
          return true;
        }
        let current = this.head;
        while (current.next != undefined) {
          current = current.next;
          if (current.element === element) {
            return true;
          }
        }
      }
      return false;
    }
    equal(obj: Object): boolean {
      if (obj === this) {
        return true;
      }
      if (!(obj instanceof List)) {
        return false;
      } else {
        let e1 = this.head;
        let e2 = obj.head;
        if (e1 !== undefined && e2 !== undefined) {
          while (e1.next !== undefined && e2.next !== undefined) {
            e1 = e1.next;
            e2 = e2.next;
            if (e1.element !== e2.element) {
              return false;
            }
          }
          return !(e1.next !== undefined || e2.next !== undefined);
        } else if (e1 !== undefined && e2 === undefined) {
          return false;
        } else if (e1 === undefined && e2 !== undefined) {
          return false;
        } else {
          return true;
        }
      }
    }
    getIndexOf(element: T): number {
      for (let i = 0; i < this.elementNum; i++) {
        const curNode = this.getNode(i);
        if (curNode !== undefined && curNode.element === element) {
          return i;
        }
      }
      return -1;
    }
    getLastIndexOf(element: T): number {
      for (let i = this.elementNum - 1; i >= 0; i--) {
        const curNode = this.getNode(i);
        if (curNode !== undefined && curNode.element === element) {
          return i;
        }
      }
      return -1;
    }
    removeByIndex(index: number): T {
      if (index < 0 || index >= this.elementNum) {
        throw new RangeError("the index is out-of-bounds");
      }
      let oldNode = this.head;
      if (index === 0) {
        oldNode = this.head;
        this.head = oldNode && oldNode.next;
      } else {
        let prevNode = this.getNode(index - 1);
        oldNode = prevNode.next;
        prevNode.next = oldNode.next;
      }
      this.elementNum--;
      return oldNode && oldNode.element;
    }
    remove(element: T): boolean {
      if (this.has(element)) {
        let index = this.getIndexOf(element);
        this.removeByIndex(index);
        return true;
      }
      return false;
    }
    replaceAllElements(callbackfn: (value: T, index?: number, list?: List<T>) => T,
      thisArg?: Object): void {
      let index = 0;
      if (this.head !== undefined) {
        let current = this.head;
        if (this.elementNum > 0) {
          this.getNode(index).element = callbackfn.call(thisArg, this.head.element, index, this);
        }
        while (current.next != undefined) {
          current = current.next;
          this.getNode(++index).element = callbackfn.call(thisArg, current.element, index, this);
        }
      }
    }
    getFirst(): T {
      if (this.isEmpty()) {
        return undefined;
      }
      let element = this.head.element;
      return element;
    }
    getLast(): T {
      if (this.isEmpty()) {
        return undefined;
      }
      let newNode = this.getNode(this.elementNum - 1);
      let element = newNode.element;
      return element;
    }
    insert(element: T, index: number): void {
      if (index < 0 || index >= this.elementNum) {
        throw new RangeError("the index is out-of-bounds");
      }
      let newNode = new NodeObj(element);
      if (index >= 0 && index < this.elementNum) {
        if (index === 0) {
          const current = this.head;
          newNode.next = current;
          this.head = newNode;
        } else {
          const prevNode = this.getNode(index - 1);
          newNode.next = prevNode.next;
          prevNode.next = newNode;
        }
        this.elementNum++;
      }
    }
    set(index: number, element: T): T {
      if (index < 0 || index >= this.elementNum) {
        throw new RangeError("the index is out-of-bounds");
      }
      const current = this.getNode(index);
      current.element = element;
      return current.element;
    }
    sort(comparator: (firstValue: T, secondValue: T) => number): void {
      let isSort = true;
      for (let i = 0; i < this.elementNum; i++) {
        for (let j = 0; j < this.elementNum - 1 - i; j++) {
          if (
            comparator(this.getNode(j).element, this.getNode(j + 1).element) > 0
          ) {
            isSort = false;
            let temp = this.getNode(j).element;
            this.getNode(j).element = this.getNode(j + 1).element;
            this.getNode(j + 1).element = temp;
          }
        }
        if (isSort) {
          break;
        }
      }
    }
    getSubList(fromIndex: number, toIndex: number): List<T> {
      if (toIndex <= fromIndex) {
        throw new RangeError(`the toIndex cannot be less than or equal to fromIndex`);
      }
      if (fromIndex >= this.elementNum || fromIndex < 0 || toIndex < 0) {
        throw new RangeError(`the fromIndex or the toIndex is out-of-bounds`);
      }
      toIndex = toIndex >= this.elementNum ? this.elementNum : toIndex;
      let list = new List<T>();
      for (let i = fromIndex; i < toIndex; i++) {
        let element = this.getNode(i).element;
        list.add(element);
        if (element === undefined) {
          break;
        }
      }
      return list;
    }
    convertToArray(): Array<T> {
      let arr: Array<T> = [];
      let index = 0;
      if (this.elementNum <= 0) {
        return arr;
      }
      if (this.head !== undefined) {
        let current = this.head;
        arr[index] = this.head.element;
        while (current.next != undefined) {
          current = current.next;
          arr[++index] = current.element;
        }
      }
      return arr;
    }
    isEmpty(): boolean {
      return this.elementNum == 0;
    }
    forEach(callbackfn: (value: T, index?: number, list?: List<T>) => void,
      thisArg?: Object): void {
      let index = 0;
      if (this.head !== undefined) {
        let current = this.head;
        if (this.elementNum > 0) {
          callbackfn.call(thisArg, this.head.element, index, this);
        }
        while (current.next != undefined) {
          current = current.next;
          callbackfn.call(thisArg, current.element, ++index, this);
        }
      }
    }
    [Symbol.iterator](): IterableIterator<T> {
      let count = 0;
      let list = this;
      return {
        next: function () {
          let done = count >= list.elementNum;
          let value = !done ? list.getNode(count++).element : undefined;
          return {
            done: done,
            value: value,
          };
        },
      };
    }
  }
  Object.freeze(List);
  fastList = List;
}
export default fastList;
