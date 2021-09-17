/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
class LruBuffer {
    constructor(capacity) {
        this.maxSize = 64;
        this.putCount = 0;
        this.createCount = 0;
        this.evictionCount = 0;
        this.hitCount = 0;
        this.missCount = 0;
        if (capacity !== undefined) {
            if (capacity <= 0) {
                throw new Error('data error');
            }
            this.maxSize = capacity;
        }
        this.cache = new Map();
    }
    updateCapacity(newCapacity) {
        if (newCapacity <= 0) {
            throw new Error('data error');
        }
        else if (this.cache.size > newCapacity) {
            this.changeCapacity(newCapacity);
        }
        this.maxSize = newCapacity;
    }
    get(key) {
        if (key === null) {
            throw new Error('key search failed');
        }
        let value;
        if (this.cache.has(key)) {
            value = this.cache.get(key);
            this.hitCount++;
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }
        this.missCount++;
        let createValue = this.createDefault(key);
        if (createValue === undefined) {
            return undefined;
        }
        else {
            value = this.put(key, createValue);
            this.createCount++;
            if (value !== null) {
                this.put(key, value);
                this.afterRemoval(false, key, createValue, value);
                return value;
            }
            return createValue;
        }
    }
    put(key, value) {
        if (key === null || value === null) {
            throw new Error('key or value search failed');
        }
        let former;
        this.putCount++;
        if (this.cache.has(key)) {
            former = this.cache.get(key);
            this.cache.delete(key);
            this.afterRemoval(false, key, former, null);
        }
        else if (this.cache.size >= this.maxSize) {
            this.cache.delete(this.cache.keys().next().value);
            this.evictionCount++;
        }
        this.cache.set(key, value);
        return former;
    }
    getCreatCount() {
        return this.createCount;
    }
    getMissCount() {
        return this.missCount;
    }
    getRemovalCount() {
        return this.evictionCount;
    }
    getMatchCount() {
        return this.hitCount;
    }
    getPutCount() {
        return this.putCount;
    }
    capacity() {
        return this.maxSize;
    }
    size() {
        return this.cache.size;
    }
    clear() {
        this.cache.clear();
        this.afterRemoval(false, this.cache.keys(), this.cache.values(), null);
    }
    isEmpty() {
        let temp = false;
        if (this.cache.size === 0) {
            temp = true;
        }
        return temp;
    }
    contains(key) {
        let flag = false;
        if (this.cache.has(key)) {
            flag = true;
            let value;
            this.hitCount++;
            value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
            return flag;
        }
        this.missCount++;
        return flag;
    }
    remove(key) {
        if (key === null) {
            throw new Error('key search failed');
        }
        else if (this.cache.has(key)) {
            let former;
            former = this.cache.get(key);
            this.cache.delete(key);
            if (former !== null) {
                this.afterRemoval(false, key, former, null);
                return former;
            }
        }
        return undefined;
    }
    toString() {
        let peek = 0;
        let hitRate = 0;
        peek = this.hitCount + this.missCount;
        if (peek !== 0) {
            hitRate = 100 * this.hitCount / peek;
        }
        else {
            hitRate = 0;
        }
        let str = '';
        str = 'Lrubuffer[ maxSize = ' + this.maxSize + ', hits = ' + this.hitCount + ', misses = ' + this.missCount
            + ', hitRate = ' + hitRate + '% ]';
        return str;
    }
    values() {
        let arr = [];
        for (let value of this.cache.values()) {
            arr.push(value);
        }
        return arr;
    }
    keys() {
        let arr = [];
        for (let key of this.cache.keys()) {
            arr.push(key);
        }
        return arr;
    }
    afterRemoval(isEvict, key, value, newValue) {
    }
    createDefault(key) {
        return undefined;
    }
    changeCapacity(newCapacity) {
        while (this.cache.size > newCapacity) {
            this.cache.delete(this.cache.keys().next().value);
            this.evictionCount++;
            this.afterRemoval(true, this.cache.keys(), this.cache.values(), null);
        }
    }
}
export default {
    LruBuffer: LruBuffer,
};
