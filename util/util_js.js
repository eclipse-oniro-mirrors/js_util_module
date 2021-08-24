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

function switchLittleObject(str, obj, count)
{
    if (obj instanceof Array) {
        str += ' [ ' + arrayToString(obj, count) + '[length]: ' + obj.length + ' ],\n  ';
        str = str.substr(0, str.length - 4);
    }
    else if (typeof obj === 'object') {
        count++;
        str += '{ ';
        var i = 0;
        for (i in obj) {
            str += switchLittleValue(i, obj[i], count);
        }
        str = str.substr(0, str.length - 4);
        str = str + ' }';
    } else if (typeof obj === 'function') {
        str += '{ ';
        str += '[Function: ' + obj.name + ']\n  ' + '[length]: '
        + obj.length + ',\n' + '  [name] :\'' + obj.name + '\',\n' + '  [prototype]: ' + obj.name
        + ' { [constructor]: [Circular] },\n  ';
        str = str.substr(0, str.length - 4);
        str = str + ' }';
    } else if (typeof obj === 'string') {
        str += '\'' + obj + '\'' + '\n  ';
    } else if (typeof obj === 'number') {
        str += obj.toString();
    }
    return str;
}

function switchLittleValue(protoName, obj, count) {
    var str = '';
    if (obj === null) {
        str += protoName + ': null,\n  ';
    } else if (obj instanceof Array) {
        str += protoName + ': [ ' + arrayToString(obj, count) + '[length]: ' + obj.length + ' ],\n  ';
    } else if (typeof obj === 'object') {
        str += protoName + ': \n  ';
        var temp = '';
        str += switchLittleObject(temp, obj, count) + ',\n  ';
    } else if (typeof obj === 'function') {
        str += '{ [Function: ' + obj.name + ']\n ' + '[length]: ' + obj.length + ',\n'
            + '  [name] :\'' + obj.name + '\'';
        if (count === 1) {
            str += ',\n  [prototype]: ' + obj.name + '{ [constructor]: [Circular] } },\n  ';
        } else {
            str += ',\n  [prototype]: ' + '[' + obj.name + '] },\n  ';
        }
    } else {
        if (typeof obj === 'string') {
            str += protoName + ': \'' + obj + '\',\n  ';
        } else if (typeof obj === 'number') {
            str += protoName + ': ' + obj + ',\n  ';
        }
    }
    return str;
}

function arrayToString(arr, count)
{
    var str = '';
    if (!arr.length) {
        return '';
    }
    var i = 0;
    for (i in arr) {
        if (typeof arr[i] === 'string') {
            str += '\'' + arr[i].toString() + '\', ';
        } else if (typeof arr[i] === 'object') {
            var temp = '';
            str += '\n  ' + switchLittleObject(temp, arr[i], count);
            str += ',\n  ';
        } else if (typeof arr[i] === 'function') {
            var end = '';
            if (arr[i].name !== '') {
                str += '{ [Function: ' + arr[i].name + ']\n  ';
                end = ' [' + arr[i].name + '] },\n  ';
            } else {
                str += '{ [Function]\n  ';
                end = '[Object] },\n  ';
            }
            str += '[length]: '
                + arr[i].length + ',\n' + '  [name] :\'' + arr[i].name
                + '\',\n' + ',\n  [prototype]: ' + end;
        } else {
            str += arr[i].toString() + ', ';
        }
    }
    return str;
}

function switchBigObject(obj)
{
    var str = '';
    if (obj instanceof Array) {
        str += '[ ';
        var i = 0;
        for (i in obj) {
            if (typeof obj[i] === 'string') {
                str += '\'' + obj[i] + '\', ';
            } else if (typeof obj[i] === 'number') {
                str += obj[i] + ', ';
            }
        }
        str = str.substr(0, str.length - 2);
        str += ' ] ,';
    } else if (typeof obj === 'function') {
        str += '[Function: ' + obj.name + '],\n';
    } else if (typeof obj === 'string') {
        str += '\'' + obj + '\' ,';
    } else if (typeof obj === 'number') {
        str += obj.toString() + ' ,';
    } else if (typeof obj === 'object') {
        str += '{ ';
        var i = 0;
        for (i in obj) {
            if (typeof obj[i] === 'function') {
                str += i + ': [Function: ' + obj[i].name + '] ,';
            } else if (typeof obj[i] === 'string') {
                str += i + ': \'' + obj[i] + '\' ,';
            } else if (typeof obj[i] === 'number') {
                str += i + ': ' + obj[i].toString() + ' ,';
            } else if (obj[i] instanceof Array) {
                str += '[ ';
                var i = 0;
                var j = 0;
                for (i in obj[i]) {
                    if (typeof obj[i][j] === 'string') {
                        str += '\'' + obj[i][j] + '\', ';
                    } else if (typeof obj[i][j] === 'number') {
                        str += obj[i][j] + ', ';
                    }
                }
                str = str.substr(0, str.length - 2);
                str += ' ] ,';
            } else if (typeof obj[i] === 'boolean') {
                str += obj[i].toString() + ',';
            }
        }
        str = str.substr(0, str.length - 1);
        str += '},';
    } else if (typeof obj === 'boolean') {
        str += obj.toString() + ',';
    }
    str = str.substr(0, str.length - 1);
    str = str + '\n';
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
        let inputType = typeof valueString[i];
        if (arr[i] === 'o') {
            var str = '';
            var count = 0;
            switchString.push(switchLittleObject(str, valueString[i], count));
        } else if (arr[i] === 'O') {
            switchString.push(switchBigObject(valueString[i]));
        } else if (arr[i] === 'i') {
            if (inputType === 'number') {
                switchString.push(parseInt(valueString[i], 10).toString()); // 10:The function uses decimal.
            } else if (valueString[i] instanceof Array) {
                if (typeof valueString[i][0] === 'number') {
                    switchString.push(parseInt(valueString[i][0], 10).toString()); // 10:The function uses decimal.
                } else if (typeof valueString[i][0] === 'string') {
                    if (isNaN(valueString[i][0])) {
                        switchString.push('NaN');
                    } else {
                        switchString.push(parseInt(valueString[i][0], 10).toString()); // 10:The function uses decimal.
                    }
                }
            } else if (typeof valueString[i] === 'string') {
                if (isNaN(valueString[i])) {
                    switchString.push('NaN');
                } else {
                    switchString.push(parseInt(valueString[i], 10).toString()); // 10:The function uses decimal.
                }
            } else {
                switchString.push('NaN');
            }
        } else if (arr[i] === 'j') {
            switchString.push(JSON.stringify(valueString[i]));
        } else if (arr[i] === 'd') {
            if (inputType === 'number') {
                switchString.push(valueString[i].toString());
            } else if (inputType === 'boolean') {
                if (valueString[i] === false) {
                    switchString.push('0');
                } else {
                    switchString.push('1');
                }
            } else {
                switchString.push('NaN');
            }
        } else if (arr[i] === 's') {
            if (inputType === 'string') {
                switchString.push(valueString[i]);
            } else if (valueString[i] instanceof Array) {
                var k = 0;
                var strLength = valueString[i].length;
                for (; k < strLength; k++) {
                    switchString.push(valueString[i][k].toString());
                }
            } else if (inputType === 'object') {
                switchString.push('[object Object]');
            } else {
                switchString.push(valueString[i].toString());
            }
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
};