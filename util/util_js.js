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

const helpUtil = requireInternal('util');
let TextEncoder = helpUtil.TextEncoder;
let TextDecoder = helpUtil.TextDecoder;
let RationalNumber = helpUtil.RationalNumber;
let Base64 = helpUtil.Base64;

function switchLittleObject(enter, obj, count)
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
        var i = 0;
        for (i in obj) {
            str += switchLittleValue(enter, i, obj, count);
        }
        if (i === 0) {
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

function switchLittleValue(enter, protoName, obj, count)
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

function arrayToString(enter, arr, count)
{
    var str = '';
    if (!arr.length) {
        return '';
    }
    var i = 0;
    var arrayEnter = ', ';
    for (i in arr) {
        if (arr[i] !== null && (typeof arr[i] === 'function' || typeof arr[i] === 'object') && count <= 2) {
            arrayEnter += enter;
            break;
        }
    }
    i = 0;
    for (i in arr) {
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

function switchBigObject(enter, obj, count)
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
        var i = 0;
        for (i in obj) {
            str += switchBigValue(enter, i, obj, count);
        }
        if (i === 0) {
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

function switchBigValue(enter, protoName, obj, count)
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

function arrayToBigString(enter, arr, count)
{
    var str = '';
    if (!arr.length) {
        return '';
    }
    var i = 0;
    var arrayEnter = ', ';
    for (i in arr) {
        if (arr[i] !== null && (typeof arr[i] === 'object') && count <= 2) {
            arrayEnter += enter;
            break;
        }
    }
    i = 0;
    for (i in arr) {
        if (typeof arr[i] === 'string') {
            str += '\'' + arr[i] + '\'' + arrayEnter;
        } else if (typeof arr[i] === 'object') {
            str += switchBigObject(enter + '  ', arr[i], count + 1);
            str += arrayEnter;
        } else if (typeof arr[i] === 'function') {
            var end = '';
            if (arr[i].name !== '') {
                str += '[Function: ' + arr[i].name + ']' + arrayEnter;
            } else {
                str += '[Function]' + arrayEnter;
            }
        } else {
            str += arr[i] + arrayEnter;
        }
    }
    str = str.substr(0, str.length - arrayEnter.length);
    return str;
}

function switchIntValue(value)
{
    var str = '';
    if (value === '') {
        str += 'NaN';
    } else if (typeof value === 'bigint') {
        str += value + 'n';
    } else if (typeof value === 'symbol') {
        str += 'NaN';
    } else if (typeof value === 'number') {
        str += parseInt(value, 10); // 10:The function uses decimal.
    } else if (value instanceof Array) {
        if (typeof value[0] === 'number') {
            str += parseInt(value[0], 10); // 10:The function uses decimal.
        } else if (typeof value[0] === 'string') {
            if (isNaN(value[0])) {
                str += 'NaN';
            } else {
                str += parseInt(value[0], 10); // 10:The function uses decimal.
            }
        }
    } else if (typeof value === 'string') {
        if (isNaN(value)) {
            str += 'NaN';
        } else {
            str += parseInt(value, 10); // 10:The function uses decimal.
        }
    } else {
        str += 'NaN';
    }
    return str;
}

function switchFloatValue(value)
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
            str += parseFloat(value);
        } else if (typeof value[0] === 'string') {
            if (isNaN(value[0])) {
                str += 'NaN';
            } else {
                str += parseFloat(value[0]);
            }
        }
    } else if (typeof value === 'string') {
        if (isNaN(value)) {
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

function switchNumberValue(value)
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
        if (isNaN(value)) {
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

function switchStringValue(value)
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

function printf(formatString, ...valueString)
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

function getErrorString(errnum)
{
    var errorString = helpUtil.geterrorstring(errnum);
    return errorString;

}

function callbackified(original, ...args)
    {
        const maybeCb = args.pop();
        if (typeof maybeCb !== 'function') {
            throw new Error('maybe is not function');
        }
        const cb = (...args) => {
            Reflect.apply(maybeCb, this, args);
        };
        Reflect.apply(original, this, args).then((ret) => cb(null, ret), (rej) => cb(rej));
    }

function callbackWrapper(original)
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

    function cb(...args) {
        callbackified(original, ...args);
    }

    Object.defineProperties(cb, descriptors);
    return cb;
}

function promiseWrapper(func) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            let callback = function (err, ...values) {
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

export default {
    printf: printf,
    getErrorString: getErrorString,
    callbackWrapper: callbackWrapper,
    promiseWrapper: promiseWrapper,
    TextEncoder: TextEncoder,
    TextDecoder: TextDecoder,
    RationalNumber: RationalNumber,
    Base64: Base64,
};