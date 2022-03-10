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
let fastDeque = undefined;
let arkPritvate = globalThis["ArkPrivate"] || undefined;
if (arkPritvate !== undefined) {
  fastDeque = arkPritvate.Load(arkPritvate.Deque);
} else {
  flag = true;
}
if (flag || fastDeque == undefined) {
  class HandlerDeque<T> {
    private isOutBounds(obj: Deque<T>, prop: any) {
      let index = Number.parseInt(prop);
      if (Number.isInteger(index)) {
        if (index < 0) {
          throw new RangeError("the index is out-of-bounds");
        }
      }
    }
    get(obj: Deque<T>, prop: any): T {
      if (typeof prop === "symbol") {
        return obj[prop];
      }
      this.isOutBounds(obj, prop);
      return obj[prop];
    }
    set(obj: Deque<T>, prop: any, value: T): boolean {
      if (prop === "front" || prop === "capacity" || prop === "rear") {
        obj[prop] = value;
        return true;
      }
      let index = Number(prop);
      if (Number.isInteger(index)) {
        if (index < 0) {
          throw new RangeError("index is out-of-bounds");
        } else {
          obj[index] = value;
          return true;
        }
      }
      return false;
    }
    has(obj: Deque<T>, prop: any) {
      return obj.has(prop);
    }
    ownKeys(obj: Deque<T>) {
      let keys = [];
      for (let i = 0; i < obj.length; i++) {
        keys.push(i.toString());
      }
      return keys;
    }
    defineProperty(obj: Deque<T>, prop: any, desc: any) {
      return true;
    }
    getOwnPropertyDescriptor(obj: Deque<T>, prop: any) {
      this.isOutBounds(obj, prop);
      let index = Number.parseInt(prop);
      if (index >= 0 && Number.isInteger(index)) {
        return Object.getOwnPropertyDescriptor(obj, prop);
      }
      return
    }
    setPrototypeOf(obj: any, prop: any): any {
      throw new RangeError("Can setPrototype on Deque Object");
    }
  }
  interface IterableIterator<T> {
    next: () => {
      value: T;
      done: boolean;
    };
  }
  class Deque<T> {
    private front: number;
    private capacity: number;
    private rear: number;
    constructor() {
      this.front = 0;
      this.capacity = 8;
      this.rear = 0;
      return new Proxy(this, new HandlerDeque());
    }
    get length() {
      let result = (this.rear - this.front + this.capacity) % this.capacity;
      return result;
    }
    insertFront(element: T): void {
      if (this.isFull()) {
        this.increaseCapacity();
      }
      this.front = (this.front - 1 + this.capacity) % this.capacity;
      this[this.front] = element;
    }
    insertEnd(element: T): void {
      if (this.isFull()) {
        this.increaseCapacity();
      }
      this[this.rear] = element;
      this.rear = (this.rear + 1) % (this.capacity + 1);
    }
    getFirst(): T {
      if (this.isEmpty()) {
        return undefined;
      }
      return this[this.front];
    }
    getLast(): T {
      if (this.isEmpty()) {
        return undefined;
      }
      return this[this.rear - 1];
    }
    has(element: T): boolean {
      let result = false;
      this.forEach(function (value, index) {
        if (value == element) {
          result = true;
        }
      });
      return result;
    }
    popFirst(): T {
      if (this.isEmpty()) {
        return undefined;
      }
      let result = this[this.front];
      this.front = (this.front + 1) % (this.capacity + 1);
      return result;
    }
    popLast(): T {
      if (this.isEmpty()) {
        return undefined;
      }
      let result = this[this.rear - 1];
      this.rear = (this.rear + this.capacity) % (this.capacity + 1);
      return result;
    }
    forEach(callbackfn: (value: T, index?: number, deque?: Deque<T>) => void,
      thisArg?: Object): void {
      let k = 0;
      let i = this.front;
      while (true) {
        callbackfn.call(thisArg, this[i], k, this);
        i = (i + 1) % this.capacity;
        k++;
        if (i === this.rear) {
          break;
        }
      }
    }
    private increaseCapacity(): void {
      let count = 0;
      let arr = [];
      let length = this.length;
      while (true) {
        arr[count++] = this[this.front];
        this.front = (this.front + 1) % this.capacity;
        if (this.front === this.rear) {
          break;
        }
      }
      for (let i = 0; i < length; i++) {
        this[i] = arr[i];
      }
      this.capacity = 2 * this.capacity;
      this.front = 0;
      this.rear = length;
    }
    private isFull(): boolean {
      return (this.rear + 1) % this.capacity === this.front;
    }
    private isEmpty(): boolean {
      return this.length == 0;
    }
    [Symbol.iterator](): IterableIterator<T> {
      let deque = this;
      let count = deque.front;
      return {
        next: function () {
          let done = count == deque.rear;
          let value = !done ? deque[count] : undefined;
          count = (count + 1) % deque.capacity;
          return {
            done: done,
            value: value,
          };
        },
      };
    }
  }
  Object.freeze(Deque);
  fastDeque = Deque;
}
export default fastDeque;
