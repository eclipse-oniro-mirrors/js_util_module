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
declare function requireInternal(s : string) : any;
const helpUtil = requireInternal('util');
let TextEncoder = helpUtil.TextEncoder;
let TextDecoder = helpUtil.TextDecoder;
let Base64 = helpUtil.Base64;

function switchLittleObject(enter : string, obj : any, count : number)
{
    var str = '';
    if (obj === null) {
        str += obj;
    } else if (obj instanceof Array) {
        str += '[ ' + arrayToString(enter, obj, count) + '[length]: ' + obj.length + ' ]';
    } else if (typeof obj === 'function') {
        str += '{ [Function: ' + obj.name + ']' + enter
            + '[length]: ' + obj.length + ',' + enter
            + '[name] :\'' + obj.name + '\',' + enter
            + '[prototype]: ' + obj.name + ' { [constructor]: [Circular] } }';
    } else if (typeof obj === 'object') {
        str += '{ ';
        let i;
        let flag = false;
        for (i in obj) {
            flag = true;
            str += switchLittleValue(enter, i, obj, count);
        }
        if (!flag) {
            return obj;
        }
        str = str.substr(0, str.length - enter.length - 1);
        str += ' }';
    } else if (typeof obj === 'string') {
        str += '\'' + obj + '\'';
    } else {
        str += obj;
    }
    return str;
}

function switchLittleValue(enter : string, protoName : any, obj : any, count : number)
{
    var str = '';
    if (obj[protoName] === null) {
        str += protoName + ': null,' + enter;
    } else if (obj[protoName] instanceof Array) {
        str += protoName + ':' + enter
            + '[ ' + arrayToString(enter + '  ', obj[protoName], count) + '[length]: '
            + obj[protoName].length + ' ],' + enter;
    } else if (typeof obj[protoName] === 'object') {
        if (obj[protoName] === obj) {
            str += protoName + ': [Circular]' + enter;
        } else {
            str += protoName + ':' + enter;
            str += switchLittleObject(enter + '  ', obj[protoName], count + 1) + ',' + enter;
        }
    } else if (typeof obj[protoName] === 'function') {
        var space = enter;
        if (obj[protoName].name !== '') {
            str += obj[protoName].name + ':' + space;
        }
        space += '  ';
        str += '{ [Function: ' + obj[protoName].name + ']' + space
            + '[length]: ' + obj[protoName].length + ',' + space
            + '[name] :\'' + obj[protoName].name + '\',' + space
            + '[prototype]: ' + obj[protoName].name
            + ' { [constructor]: [Circular] } },' + enter;
    } else {
        if (typeof obj[protoName] === 'string') {
            str += protoName + ': \'' + obj[protoName] + '\',' + enter;
        } else {
            str += protoName + ': ' + obj[protoName] + ',' + enter;
        }
    }
    return str;
}

function arrayToString(enter : string, arr : any, count : number)
{
    var str = '';
    if (!arr.length) {
        return '';
    }
    var arrayEnter = ', ';
    for (let k in arr) {
        if (arr[k] !== null && (typeof arr[k] === 'function' || typeof arr[k] === 'object') && count <= 2) {
            arrayEnter += enter;
            break;
        }
    }
    for (let i in arr) {
        if (typeof arr[i] === 'string') {
            str += '\'' + arr[i].toString() + '\'' + arrayEnter;
        } else if (typeof arr[i] === 'object') {
            str += switchLittleObject(enter + '  ', arr[i], count + 1);
            str += arrayEnter;
        } else if (typeof arr[i] === 'function') {
            var space = enter;
            space += '  ';
            var end = '';
            if (arr[i].name !== '') {
                str += '{ [Function: ' + arr[i].name + ']' + space;
                end = arr[i].name + ' { [constructor]: [Circular] } }' + arrayEnter;
            } else {
                str += '{ [Function]' + space;
                end = '{ [constructor]: [Circular] } }' + arrayEnter;
            }
            str += '[length]: '
                + arr[i].length + ',' + space
                + '[name] :\'' + arr[i].name + '\',' + space
                + '[prototype]: ' + end;
        } else {
            str += arr[i] + arrayEnter;
        }
    }
    return str;
}

function switchBigObject(enter : string, obj : any, count : number)
{
    var str = '';
    if (obj === null) {
        str += obj;
    } else if (obj instanceof Array) {
        str += '[ ' + arrayToBigString(enter, obj, count) + ' ]';
    } else if (typeof obj === 'function') {
        str += '{ [Function: ' + obj.name + '] }';
    } else if (typeof obj === 'object') {
        str += '{ ';
        let i;
        let flag = false;
        for (i in obj) {
            flag = true;
            str += switchBigValue(enter, i, obj, count);
        }
        if (!flag) {
            return obj;
        }
        str = str.substr(0, str.length - enter.length - 1);
        str += ' }';
    } else if (typeof obj === 'string') {
        str += '\'' + obj + '\'';
    } else {
        str += obj;
    }
    return str;
}

function switchBigValue(enter : string, protoName : any, obj : any, count : number)
{
    var str = '';
    if (obj[protoName] === null) {
        str += protoName + ': null,' + enter;
    } else if (obj[protoName] instanceof Array) {
        str += protoName + ':' + enter
            + '[ ' + arrayToBigString(enter + '  ', obj[protoName], count) + ' ],' + enter;
    } else if (typeof obj[protoName] === 'object') {
        if (obj[protoName] === obj) {
            str += protoName + ': [Circular]' + enter;
        } else {
            str += protoName + ':' + enter;
            str += switchBigObject(enter + '  ', obj[protoName], count + 1) + ',' + enter;
        }
    } else if (typeof obj[protoName] === 'function') {
        if (obj[protoName].name !== '') {
            str += obj[protoName].name + ': ';
        }
        str += '[Function: ' + obj[protoName].name + '],' + enter;
    } else {
        if (typeof obj[protoName] === 'string') {
            str += protoName + ': \'' + obj[protoName] + '\',' + enter;
        } else {
            str += protoName + ': ' + obj[protoName] + ',' + enter;
        }
    }
    return str;
}

function arrayToBigString(enter : string, arr : any, count : number)
{
    var str = '';
    if (!arr.length) {
        return '';
    }

    var arrayEnter = ', ';
    for (let i in arr) {
        if (arr[i] !== null && (typeof arr[i] === 'object') && count <= 2) {
            arrayEnter += enter;
            break;
        }
    }
    for (let j in arr) {
        if (typeof arr[j] === 'string') {
            str += '\'' + arr[j] + '\'' + arrayEnter;
        } else if (typeof arr[j] === 'object') {
            str += switchBigObject(enter + '  ', arr[j], count + 1);
            str += arrayEnter;
        } else if (typeof arr[j] === 'function') {
            if (arr[j].name !== '') {
                str += '[Function: ' + arr[j].name + ']' + arrayEnter;
            } else {
                str += '[Function]' + arrayEnter;
            }
        } else {
            str += arr[j] + arrayEnter;
        }
    }
    str = str.substr(0, str.length - arrayEnter.length);
    return str;
}

function switchIntValue(value : any)
{
    var str = '';
    if (value === '') {
        str += 'NaN';
    } else if (typeof value === 'bigint') {
        str += value + 'n';
    } else if (typeof value === 'symbol') {
        str += 'NaN';
    } else if (typeof value === 'number') {
        str += parseInt(<any>value, 10); // 10:The function uses decimal.
    } else if (value instanceof Array) {
        if (typeof value[0] === 'number') {
            str += parseInt(<any>value[0], 10); // 10:The function uses decimal.
        } else if (typeof value[0] === 'string') {
            if (isNaN(<any>value[0])) {
                str += 'NaN';
            } else {
                str += parseInt(value[0], 10); // 10:The function uses decimal.
            }
        }
    } else if (typeof value === 'string') {
        if (isNaN(<any>value)) {
            str += 'NaN';
        } else {
            str += parseInt(value, 10); // 10:The function uses decimal.
        }
    } else {
        str += 'NaN';
    }
    return str;
}

function switchFloatValue(value : any)
{
    var str = '';
    if (value === '') {
        str += 'NaN';
    } else if (typeof value === 'symbol') {
        str += 'NaN';
    } else if (typeof value === 'number') {
        str += value;
    } else if (value instanceof Array) {
        if (typeof value[0] === 'number') {
            str += parseFloat(<any>value);
        } else if (typeof value[0] === 'string') {
            if (isNaN(<any>value[0])) {
                str += 'NaN';
            } else {
                str += parseFloat(value[0]);
            }
        }
    } else if (typeof value === 'string') {
        if (isNaN(<any>value)) {
            str += 'NaN';
        } else {
            str += parseFloat(value);
        }
    } else if (typeof value === 'bigint') {
        str += value;
    } else {
        str += 'NaN';
    }
    return str;
}

function switchNumberValue(value : any)
{
    var str = '';
    if (value === '') {
        str += '0';
    } else if (typeof value === 'symbol') {
        str += 'NaN';
    } else if (typeof value === 'number') {
        str += value;
    } else if (value instanceof Array) {
        str += 'NaN';
    } else if (typeof value === 'string') {
        if (isNaN(<any>value)) {
            str += 'NaN';
        } else {
            str += Number(value);
        }
    } else if (typeof value === 'bigint') {
        str += value.toString() + 'n';
    } else {
        str += 'NaN';
    }
    return str;
}

function switchStringValue(value : any)
{
    var str = '';
    if (typeof value === 'undefined') {
        str += 'undefined';
    } else if (typeof value === 'object') {
        if (value === null) {
            str += 'null';
        } else {
            str += value;
        }
    } else if (typeof value === 'symbol') {
        str += value.toString();
    } else {
        str += value;
    }
    return str;
}

function printf(formatString : any, ...valueString : any)
{
    var formats = helpUtil.dealwithformatstring(formatString);
    var arr = [];
    arr = formats.split(' ');
    var switchString = [];
    var valueLength = valueString.length;
    var arrLength = arr.length;
    var i = 0;
    for (; i < valueLength && i < arrLength; i++) {
        if (arr[i] === 'o') {
            switchString.push(switchLittleObject('\n  ', valueString[i], 1));
        } else if (arr[i] === 'O') {
            switchString.push(switchBigObject('\n  ', valueString[i], 1));
        } else if (arr[i] === 'i') {
            switchString.push(switchIntValue(valueString[i]));
        } else if (arr[i] === 'j') {
            switchString.push(JSON.stringify(valueString[i]));
        } else if (arr[i] === 'd') {
            switchString.push(switchNumberValue(valueString[i]));
        } else if (arr[i] === 's') {
            switchString.push(switchStringValue(valueString[i]));
        } else if (arr[i] === 'f') {
            switchString.push(switchFloatValue(valueString[i]));
        } else if (arr[i] === 'c') {
            switchString.push(valueString[i].toString());
        }
    }
    while (i < valueLength) {
        switchString.push(valueString[i].toString());
        i++;
    }
    var helpUtilString = helpUtil.printf(formatString, ...switchString);
    return helpUtilString;
}

function getErrorString(errnum : number)
{
    var errorString = helpUtil.geterrorstring(errnum);
    return errorString;
}

function callbackified(original : any, ...args : any)
    {
        const maybeCb = args.pop();
        if (typeof maybeCb !== 'function') {
            throw new Error('maybe is not function');
        }
        const cb = (...args : any) => {
            Reflect.apply(maybeCb, this, args);
        };
        Reflect.apply(original, this, args).then((ret : any) => cb(null, ret), (rej : any) => cb(rej));
    }

function callbackWrapper(original : any)
{
    if (typeof original !== 'function') {
        throw new Error('original is not function');
    }
    const descriptors = Object.getOwnPropertyDescriptors(original);
    if (typeof descriptors.length.value === 'number') {
        descriptors.length.value++;
    }
    if (typeof descriptors.name.value === 'string') {
        descriptors.name.value += 'callbackified';
    }

    function cb(...args : any) {
        callbackified(original, ...args);
    }
    Object.defineProperties(cb, descriptors);
    return cb;
}

function promiseWrapper(func : any) {
    // promiseWrapper
    return function (...args : any) {
        return new Promise((resolve, reject) => {
            let callback = function (err : any, ...values : any) {
                if (err) {
                    reject(err);
                } else {
                    resolve(values);
                }
            };
            func.apply(null, [...args, callback]);
        });
    };
}

class LruBuffer
{
    private cache: Map<any, any>;
    private maxSize : number = 64;
    private putCount : number = 0;
    private createCount : number = 0;
    private evictionCount : number = 0;
    private hitCount : number = 0;
    private missCount : number = 0;

    public constructor(capacity?: number)
    {
        if(capacity !== undefined) {
            if (capacity <= 0) {
                throw new Error('data error');
            }
            this.maxSize = capacity;
        }
        this.cache = new Map();
    }
    public updateCapacity(newCapacity : number)
    {
        if (newCapacity <= 0) {
            throw new Error('data error');
        } else if (this.cache.size >newCapacity) {
            this.changeCapacity(newCapacity);
        }
        this.maxSize = newCapacity;
    }
    public get(key : any) 
    {
        if (key === null) {
            throw new Error('key not be null');
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
        } else {
            value = this.put(key, createValue);
            this.createCount++;
            if (value !== undefined) {
                this.put(key, value);
                this.afterRemoval(false, key, createValue, value);
                return value;
            }
            return createValue;
        }
    }
    public put(key : any, value : any) 
    {
        if (key === null || value === null) {
            throw new Error('key or value not be null');
        }
        let former;
        this.putCount++;
        if (this.cache.has(key)) {
            former = this.cache.get(key);
            this.cache.delete(key);
            this.afterRemoval(false, key, former, value);
        } else if (this.cache.size >= this.maxSize) {
            this.cache.delete(this.cache.keys().next().value);
            this.evictionCount++;
        } 
        this.cache.set(key, value);
        return former;
    }
    public getCreatCount() 
    {   
        return this.createCount;
    }
    public getMissCount()
    {
        return this.missCount;
    }
    public getRemovalCount() 
    {
        return this.evictionCount;
    }
    public getMatchCount()  
    {
        return this.hitCount;
    }
    public getPutCount()  
    {
        return this.putCount;
    }
    public capacity()
    {
         return this.maxSize;
    }
    public size() 
    {
        return this.cache.size;
    }
    public clear()
    {
        this.cache.clear();
        this.afterRemoval(false, this.cache.keys(), this.cache.values(), null);
    }
    public isEmpty()
    {
        let temp : boolean = false;
        if (this.cache.size === 0) {
            temp = true;
        }
        return temp;
    }
    public contains(key : any)
    {
        let flag : boolean = false;
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
    public remove(key : any)
    {
        if (key === null) {
            throw new Error('key not be null');
        } else if (this.cache.has(key)) {
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
    public toString()
    {
        let peek : number = 0;
        let hitRate : number = 0;
        peek = this.hitCount + this.missCount;
        if (peek !== 0) {
            hitRate = 100 * this.hitCount / peek;
        } else {
            hitRate = 0;
        }
        let str : string = '';
        str = 'Lrubuffer[ maxSize = ' + this.maxSize + ', hits = ' + this.hitCount + ', misses = ' + this.missCount
            + ', hitRate = ' + hitRate + '% ]';
        return str;
    }
    public values()
    {
        let arr = [];
        for(let value of this.cache.values()) {
            arr.push(value);
        }
        return arr;
    }
    public keys()
    {
        let arr = [];
        for(let key of this.cache.keys()) {
            arr.push(key);
        }
        return arr;
    }
    protected afterRemoval(isEvict : boolean, key : any, value : any, newValue : any)
    {
        
    }
    protected createDefault(key : any)
    {
        return undefined;
    }
    public entries() 
    {
        let arr = [];
        for (let entry of this.cache.entries()) {
            arr.push(entry);
        }
        return arr;
    }
    public [Symbol.iterator] () 
    {
        let arr = [];
        for (let [key, value] of this.cache) {
            arr.push([key, value]);
        }
        return arr;
    }
    private changeCapacity(newCapacity : number)
    {
        while(this.cache.size >newCapacity) {
            this.cache.delete(this.cache.keys().next().value);
            this.evictionCount++;
            this.afterRemoval(true, this.cache.keys(), this.cache.values(), null);
        }
    }
}

class RationalNumber
{
    private mnum : number = 0;
    private mden : number = 0;
    public constructor(num : number, den : number)
    {
        num = den < 0 ?  num * (-1) : num;
        den = den < 0 ?  den * (-1) : den;
        if (den == 0) {
            if (num > 0) {
                this.mnum = 1;
                this.mden = 0;
            } else if (num < 0) {
                this.mnum = -1;
                this.mden = 0;
            } else {
                this.mnum = 0;
                this.mden = 0;
            }
        } else if (num == 0) {
            this.mnum = 0;
            this.mden = 1;
        } else {
            let gnum : number = 0;
            gnum = this.getCommonDivisor(num, den);
            if (gnum != 0) {
                this.mnum = num / gnum;
                this.mden = den / gnum;
            }
        }
    }

    public createRationalFromString(str : string)
    {
        if (str == null) {
            throw new Error('string invalid!');
        }
        if (str == 'NaN') {
            return new RationalNumber(0, 0);
        }
        let colon : number = str.indexOf(':');
        let semicolon : number = str.indexOf('/');
        if ((colon < 0 && semicolon < 0) || (colon > 0 && semicolon > 0)) {
            throw new Error('string invalid!');
        }
        let index : number = (colon > 0) ? colon : semicolon;
        let s1 : string = str.substr(0, index);
        let s2 : string = str.substr(index + 1, str.length);
        let num1 : number = Number(s1);
        let num2 : number = Number(s2);
        return new RationalNumber(num1, num2);
    }

    public compareTo(other : RationalNumber)
    {
        if (this.mnum == other.mnum && this.mden == other.mden) {
            return 0;
        } else if (this.mnum == 0 && this.mden == 0) {
            return 1;
        } else if ((other.mnum == 0) && (other.mden == 0)) {
            return -1;
        } else if ((this.mden == 0 && this.mnum > 0) || (other.mden == 0 && other.mnum < 0)) {
            return 1;
        } else if ((this.mden == 0 && this.mnum < 0) || (other.mden == 0 && other.mnum > 0)) {
            return -1;
        }
        let thisnum : number = this.mnum * other.mden;
        let othernum : number = other.mnum * this.mden;
        if (thisnum < othernum) {
            return -1;
        } else if (thisnum > othernum) {
            return 1;
        } else {
            return 0;
        }
    }

    public equals(obj : object)
    {
        if (!(obj instanceof RationalNumber)) {
            return false;
        }
        let thisnum : number = this.mnum * obj.mden;
        let objnum : number = obj.mnum * this.mden;
        if (this.mnum == obj.mnum && this.mden == obj.mden) {
            return true;
        } else if ((thisnum == objnum) && (this.mnum != 0 && this.mden != 0) && (obj.mnum != 0 && obj.mden != 0)) {
            return true;
        } else if ((this.mnum == 0 && this.mden != 0) && (obj.mnum == 0 && obj.mden != 0)) {
            return true;
        } else if ((this.mnum > 0 && this.mden == 0) && (obj.mnum > 0 && obj.mden == 0)) {
            return true;
        } else if ((this.mnum < 0 && this.mden == 0) && (obj.mnum < 0 && obj.mden == 0)) {
            return true;
        } else {
            return false;
        }
    }

    public value()
    {
        if (this.mnum > 0 && this.mden == 0) {
            return Number.POSITIVE_INFINITY;
        } else if (this.mnum < 0 && this.mden == 0) {
            return Number.NEGATIVE_INFINITY;
        } else if ((this.mnum == 0) && (this.mden == 0)) {
            return Number.NaN;
        } else {
            return this.mnum / this.mden;
        }
    }

    public getCommonDivisor(number1 : number, number2 : number)
    {
        if (number1 == 0 || number2 == 0) {
            throw new Error("Parameter cannot be zero!");
        }
        let temp : number = 0;
        if (number1 < number2) {
            temp = number1;
            number1 = number2;
            number2 = temp;
        }
        while (number1 % number2 != 0) {
            temp = number1 % number2;
            number1 = number2;
            number2 = temp;
        }
        return number2;
    }

    public getDenominator()
    {
        return this.mden;
    }

    public getNumerator()
    {
        return this.mnum;
    }

    public isFinite()
    {
        return this.mden != 0;
    }

    public isNaN()
    {
        return this.mnum == 0 && this.mden == 0;
    }

    public isZero()
    {
        return this.mnum == 0 && this.mden != 0;
    }

    public toString()
    {
        let buf : string;
        if (this.mnum == 0 && this.mden == 0) {
            buf = "NaN";
        } else if (this.mnum > 0 && this.mden == 0) {
            buf = "Infinity";
        } else if (this.mnum < 0 && this.mden == 0) {
            buf = "-Infinity";
        } else {
            buf = String(this.mnum) + '/' + String(this.mden);
        }
        return buf;
    }
}

interface ScopeComparable {
    compareTo(other: ScopeComparable): boolean;
}

type ScopeType = ScopeComparable;
class Scope {

    private readonly _lowerLimit: ScopeType;
    private readonly _upperLimit: ScopeType;

    public constructor(readonly lowerObj: ScopeType, readonly upperObj: ScopeType) {
        this.checkNull(lowerObj, 'lower limit not be null');
        this.checkNull(upperObj, 'upper limit not be null');

        if(lowerObj.compareTo(upperObj)) {
            throw new Error('lower limit must be less than or equal to upper limit');
        }
        this._lowerLimit = lowerObj;
        this._upperLimit = upperObj;
    }

    public getLower(): ScopeType {
        return this._lowerLimit;
    }

    public getUpper(): ScopeType {
        return this._upperLimit;
    }

    public contains(value: ScopeType): boolean;
    public contains(scope: Scope): boolean;
    public contains(x: any): boolean {
        let resLower: boolean;
        let resUpper: boolean;
        this.checkNull(x, 'value must not be null');
        if(x instanceof Scope) {
            resLower= x._lowerLimit.compareTo(this._lowerLimit);
            resUpper= this._upperLimit.compareTo(x._upperLimit);
        } else {
            resLower= x.compareTo(this._lowerLimit);
            resUpper= this._upperLimit.compareTo(x);
        }
        return resLower && resUpper;
    }

    public clamp(value: ScopeType): ScopeType {
        this.checkNull(value, 'value must not be null');

        if (!value.compareTo(this._lowerLimit)) {
            return this._lowerLimit;
        } else if (value.compareTo(this._upperLimit)) {
            return this._upperLimit;
        } else {
            return value;
        }
    }

    public intersect(scope: Scope): Scope;
    public intersect(lowerObj: ScopeType, upperObj: ScopeType): Scope;
    public intersect(x: any, y?: any): Scope {
        let reLower: boolean;
        let reUpper: boolean;
        let mLower: ScopeType;
        let mUpper: ScopeType;
        if(y)
        {
            this.checkNull(x, 'lower limit must not be null');
            this.checkNull(y, 'upper limit must not be null');
            reLower = this._lowerLimit.compareTo(x);
            reUpper = y.compareTo(this._upperLimit);
            if (reLower && reUpper) {
                return this;
            } else {
            mLower = reLower ? this._lowerLimit : x;
            mUpper = reUpper ? this._upperLimit : y;
            return new Scope(mLower, mUpper);
            }
        } else {
            this.checkNull(x, 'scope must not be null');
            reLower = this._lowerLimit.compareTo(x._lowerLimit);
            reUpper = x._upperLimit.compareTo(this._upperLimit);
            if (!reLower && !reUpper) {
                return x;
            } else if (reLower && reUpper) {
                return this;
            } else {
                mLower = reLower ? this._lowerLimit : x._lowerLimit;
                mUpper = reUpper ? this._upperLimit : x._upperLimit;
                return new Scope(mLower, mUpper);
           }
        }
    }

    public expand(obj: ScopeType): Scope;
    public expand(scope: Scope): Scope;
    public expand(lowerObj: ScopeType, upperObj: ScopeType): Scope;
    public expand(x: any, y?: any): Scope {
        let reLower: boolean;
        let reUpper: boolean;
        let mLower: ScopeType;
        let mUpper: ScopeType;
        if (!y) {
            this.checkNull(x, 'value must not be null');
            if (!(x instanceof Scope)) {
                this.checkNull(x, 'value must not be null');
                return this.expand(x, x);
            }

            let reLower = x._lowerLimit.compareTo(this._lowerLimit);
            let reUpper = this._upperLimit.compareTo(x._upperLimit);
            if (reLower && reUpper) {
                 return this;
            } else if (!reLower && !reUpper) {
                 return x;
            } else {
                let mLower = reLower ? this._lowerLimit : x._lowerLimit;
                let mUpper = reUpper ? this._upperLimit : x._upperLimit;
                return new Scope(mLower, mUpper);
            }
        } else {
            this.checkNull(x, 'lower limit must not be null');
            this.checkNull(y, "upper limit must not be null");
            let reLower = x.compareTo(this._lowerLimit);
            let reUpper = this._upperLimit.compareTo(y);
            if (reLower && reUpper) {
                return this;
            }
            let mLower = reLower ? this._lowerLimit : x;
            let mUpper = reUpper ? this._upperLimit : y;
            return new Scope(mLower, mUpper);
        }
    } 

    public toString(): string {
        let strLower = this._lowerLimit.toString();
        let strUpper = this._upperLimit.toString();
        return `[${strLower}, ${strUpper}]`;
    }

    public checkNull(o: ScopeType, str: string): void {
        if(o == null) {
            throw new Error(str);
        }
    }
}

export default {
    printf: printf,
    getErrorString: getErrorString,
    callbackWrapper: callbackWrapper,
    promiseWrapper: promiseWrapper,
    TextEncoder: TextEncoder,
    TextDecoder: TextDecoder,
    Base64: Base64,
    LruBuffer: LruBuffer,
    RationalNumber : RationalNumber,
    Scope : Scope,
};
