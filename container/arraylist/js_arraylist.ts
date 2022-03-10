/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
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
let fastArrayList = undefined;
let arkPritvate = globalThis["ArkPrivate"] || undefined;
if (arkPritvate !== undefined) {
  fastArrayList = arkPritvate.Load(arkPritvate.ArrayList);
} else {
  flag = true;
}
if (flag || fastArrayList == undefined) {
  class HandlerArrayList<T> {
    private isOutBounds(obj: ArrayList<T>, prop: any) {
      let index = Number.parseInt(prop);
      if (Number.isInteger(index)) {
        if (index < 0 || index >= obj.length) {
          throw new RangeError("the index is out-of-bounds");
        }
      }
    }
    get(obj: ArrayList<T>, prop: any) {
      if (typeof prop === "symbol") {
        return obj[prop];
      }
      this.isOutBounds(obj, prop);
      return obj[prop];
    }
    set(obj: ArrayList<T>, prop: any, value: T) {
      if (prop === "elementNum" || prop === "capacity") {
        obj[prop] = value;
        return true;
      }
      let index = Number.parseInt(prop);
      if (Number.isInteger(index)) {
        if (index < 0 || index > obj.length) {
          throw new RangeError("the index is out-of-bounds");
        } else {
          obj[index] = value;
          return true;
        }
      }
      return false;
    }
    deleteProperty(obj: ArrayList<T>, prop: any) {
      this.isOutBounds(obj, prop);
      let index = Number.parseInt(prop);
      if (index >= 0 && index < obj.length && Number.isInteger(index)) {
        obj.removeByIndex(index);
        return true;
      }
      return false;
    }
    has(obj: ArrayList<T>, prop: any) {
      return obj.has(prop);
    }
    ownKeys(obj: ArrayList<T>) {
      let keys = [];
      for (let i = 0; i < obj.length; i++) {
        keys.push(i.toString());
      }
      return keys;
    }
    defineProperty(obj: ArrayList<T>, prop: any, desc: any) {
      return true;
    }
    getOwnPropertyDescriptor(obj: ArrayList<T>, prop: any) {
      this.isOutBounds(obj, prop);
      let index = Number.parseInt(prop);
      if (index >= 0 && index < obj.length && Number.isInteger(index)) {
        return Object.getOwnPropertyDescriptor(obj, prop);
      }
      return;
    }
    setPrototypeOf(obj: any, prop: any): T {
      throw new TypeError("Can setPrototype on ArrayList Object");
    }
  }
  interface IterableIterator<T> {
    next: () => {
      value: T;
      done: boolean;
    };
  }
  class ArrayList<T> {
    private elementNum: number = 0;
    private capacity: number = 10;
    constructor() {
      return new Proxy(this, new HandlerArrayList());
    }
    get length() {
      return this.elementNum;
    }
    add(element: T): boolean {
      if (this.isFull()) {
        this.resize();
      }
      this[this.elementNum++] = element;
      return true;
    }
    insert(element: T, index: number): void {
      if (index < 0 || index >= this.elementNum) {
        throw new RangeError("the index is out-of-bounds");
      }
      if (this.isFull()) {
        this.resize();
      }
      for (let i = this.elementNum; i > index; i--) {
        this[i] = this[i - 1];
      }
      this[index] = element;
      this.elementNum++;
    }
    has(element: T): boolean {
      for (let i = 0; i < this.elementNum; i++) {
        if (this[i] === element) {
          return true;
        }
      }
      return false;
    }
    getIndexOf(element: T): number {
      for (let i = 0; i < this.elementNum; i++) {
        if (element === this[i]) {
          return i;
        }
      }
      return -1;
    }
    removeByIndex(index: number): T {
      if (index < 0 || index >= this.elementNum) {
        throw new RangeError("the index is out-of-bounds");
      }
      let result = this[index];
      for (let i = index; i < this.elementNum - 1; i++) {
        this[i] = this[i + 1];
      }
      this.elementNum--;
      return result;
    }
    remove(element: T): boolean {
      if (this.has(element)) {
        let index = this.getIndexOf(element);
        for (let i = index; i < this.elementNum - 1; i++) {
          this[i] = this[i + 1];
        }
        this.elementNum--;
        return true;
      }
      return false;
    }
    getLastIndexOf(element: T): number {
      for (let i = this.elementNum - 1; i >= 0; i--) {
        if (element === this[i]) {
          return i;
        }
      }
      return -1;
    }
    removeByRange(fromIndex: number, toIndex: number): void {
      if (fromIndex >= toIndex) {
        throw new RangeError(`the fromIndex cannot be less than or equal to toIndex`);
      }
      if (fromIndex >= this.elementNum || fromIndex < 0 || toIndex < 0) {
        throw new RangeError(`the fromIndex or the toIndex is out-of-bounds`);
      }
      toIndex = toIndex >= this.elementNum ? this.elementNum : toIndex;
      let i = fromIndex;
      for (let j = toIndex; j < this.elementNum; j++) {
        this[i] = this[j];
        i++;
      }
      this.elementNum -= toIndex - fromIndex;
    }
    replaceAllElements(callbackfn: (value: T, index?: number, arrList?: ArrayList<T>) => T,
      thisArg?: Object): void {
      for (let i = 0; i < this.elementNum; i++) {
        this[i] = callbackfn.call(thisArg, this[i], i, this);
      }
    }
    forEach(callbackfn: (value: T, index?: number, arrList?: ArrayList<T>) => void,
      thisArg?: Object): void {
      for (let i = 0; i < this.elementNum; i++) {
        callbackfn.call(thisArg, this[i], i, this);
      }
    }
    sort(comparator?: (firstValue: T, secondValue: T) => number): void {
      let isSort = true;
      if (comparator) {
        for (let i = 0; i < this.elementNum; i++) {
          for (let j = 0; j < this.elementNum - 1 - i; j++) {
            if (comparator(this[j], this[j + 1]) > 0) {
              isSort = false;
              let temp = this[j];
              this[j] = this[j + 1];
              this[j + 1] = temp;
            }
          }
        }
      } else {
        for (let i = 0; i < this.length - 1; i++) {
          for (let j = 0; j < this.elementNum - 1 - i; j++) {
            if (this.asciSort(this[j], this[j + 1])) {
              isSort = false;
              let temp = this[j];
              this[j] = this[j + 1];
              this[j + 1] = temp;
            }
          }
          if (isSort) {
            break;
          }
        }
      }
    }
    private asciSort(curElement: any, nextElement: any): boolean {
      if ((Object.prototype.toString.call(curElement) === "[object String]" ||
        Object.prototype.toString.call(curElement) === "[object Number]") &&
        (Object.prototype.toString.call(nextElement) === "[object String]" ||
        Object.prototype.toString.call(nextElement) === "[object Number]")) {
        curElement = curElement.toString();
        nextElement = nextElement.toString();
        if (curElement > nextElement) {
          return true;
        }
        return false
      }
      return false;
    }
    subArrayList(fromIndex: number, toIndex: number): ArrayList<T> {
      if (fromIndex >= toIndex) {
        throw new RangeError(`the fromIndex cannot be less than or equal to toIndex`);
      }
      if (fromIndex >= this.elementNum || fromIndex < 0 || toIndex < 0) {
        throw new RangeError(`the fromIndex or the toIndex is out-of-bounds`);
      }
      toIndex = toIndex >= this.elementNum ? this.elementNum : toIndex;
      let arraylist = new ArrayList<T>();
      for (let i = fromIndex; i < toIndex; i++) {
        arraylist.add(this[i]);
      }
      return arraylist;
    }
    clear(): void {
      this.elementNum = 0;
    }
    clone(): ArrayList<T> {
      let clone = new ArrayList<T>();
      for (let i = 0; i < this.elementNum; i++) {
        clone.add(this[i]);
      }
      return clone;
    }
    getCapacity(): number {
      return this.capacity;
    }
    convertToArray(): Array<T> {
      let arr = [];
      for (let i = 0; i < this.elementNum; i++) {
        arr[i] = this[i];
      }
      return arr;
    }
    private isFull(): boolean {
      return this.elementNum === this.capacity;
    }
    private resize(): void {
      this.capacity = 1.5 * this.capacity;
    }
    isEmpty(): boolean {
      return this.elementNum == 0;
    }
    increaseCapacityTo(newCapacity: number): void {
      if (newCapacity >= this.elementNum) {
        this.capacity = newCapacity;
      }
    }
    trimToCurrentLength(): void {
      this.capacity = this.elementNum;
    }
    [Symbol.iterator](): IterableIterator<T> {
      let count = 0;
      let arraylist = this;
      return {
        next: function () {
          let done = count >= arraylist.elementNum;
          let value = !done ? arraylist[count++] : undefined;
          return {
            done: done,
            value: value,
          };
        },
      };
    }
  }
  Object.freeze(ArrayList);
  fastArrayList = ArrayList;
}
export default fastArrayList;

