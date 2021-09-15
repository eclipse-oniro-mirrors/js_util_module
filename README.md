# js_util_module Subsystems / components

-   [Introduction](#Introduction)
-   [Directory](#Directory)
-   [Description](#Description)
    -   [Interface description](#Interface description)
    -   [Instruction for use](#Instruction for use)

-   [Related warehouse](#Related warehouse)

## Introduction
The interface of util is used for character Textencoder, TextDecoder and HelpFunction module.The TextEncoder represents a text encoder that accepts a string as input, encodes it in UTF-8 format, and outputs UTF-8 byte stream. The TextDecoder interface represents a text decoder. The decoder takes the byte stream as the input and outputs the Stirng string. HelpFunction is mainly used to callback and promise functions, write and output error codes, and format class strings.
## 目录

```
base/compileruntime/js_util_module/
├── Class:TextEncoder                   # TextEncoder class
│   ├──  new TextEncoder()             	# create textencoder object
│   ├──  encode()                      	# encode method
│   ├──  encoding                     	# encoding property
│   └──  encodeInto()                   # encodeInto method
├── Class:TextDecoder                   # TextDecoder class
│   ├──  new TextDecoder()              # create TextDecoder object
│   ├──  decode()             		    # decode method
│   ├──  encoding                      	# encoding property
│   ├──  fatal	                     	# fatal property
│   └──  ignoreBOM                     	# ignoreBOM property
├── printf()			                # printf method
├── getErrorString()			        # getErrorString method
├── callbackWrapper()		            # callbackWrapper method
└── promiseWrapper()		            # promiseWrapper method
```

## Description

### Interface description


| Interface name | Description |
| -------- | -------- |
| readonly encoding : string | Get the encoding format, only UTF-8 is supported. |
| encode(input : string) : Uint8Array | Input stirng string, encode and output UTF-8 byte stream. |
| encodeInto(input : string, dest : Uint8Array) : {read : number, written : number} | Enter the stirng string, dest represents the storage location after encoding, and returns an object, read represents the number of characters that have been encoded,and written represents the size of bytes occupied by the encoded characters. |
| constructor(encoding? : string, options? : {fatal? : boolean, ignoreBOM? : boolean}) | Constructor, the first parameter encoding indicates the format of decoding.The second parameter represents some attributes.Fatal in the attribute indicates whether an exception is thrown, and ignoreBOM indicates whether to ignore the bom flag. |
| readonly encoding : string | Get the set decoding format. |
| readonly fatal : boolean | Get the setting that throws the exception. |
| readonly ignoreBOM : boolean | Get whether to ignore the setting of the bom flag. |
| decode(input : ArrayBuffer | Input the data to be decoded, and solve the corresponding string character string.The first parameter input represents the data to be decoded, and the second parameter options represents a bool flag, which means that additional data will be followed. The default is false. |
| function printf(format: string, ...args: Object[]): string | The util.format() method returns a formatted string using the first argument as a printf-like format string which can contain zero or more format specifiers. |
| function getErrorString(errno: number): string |  The geterrorstring () method uses a system error number as a parameter to return system error information. |
| function callbackWrapper(original: Function): (err: Object, value: Object) => void | Takes an async function (or a function that returns a Promise) and returns a function following the error-first callback style, i.e. taking an (err, value) => ... callback as the last argument. In the callback, the first argument will be the rejection reason (or null if the Promise resolved), and the second argument will be the resolved value. |
| function promiseWrapper(original: (err: Object, value: Object) => void): Object |     Takes a function following the common error-first callback style, i.e. taking an (err, value) => ... callback as the last argument, and returns a version that returns promises. |

Each specifier in printf is replaced with a converted value from the corresponding parameter. Supported specifiers are:
| Stylized character | Style requirements |
| -------- | -------- |
|    %s: | String will be used to convert all values except BigInt, Object and -0. |
|    %d: | Number will be used to convert all values except BigInt and Symbol. |
|    %i:  | parseInt(value, 10) is used for all values except BigInt and Symbol. |
|    %f:  | parseFloat(value) is used for all values expect Symbol. |
|    %j:  | JSON. Replaced with the string '[Circular]' if the argument contains circular references. |
|    %o:  | Object. A string representation of an object with generic JavaScript object formatting. Similar to util.inspect() with options { showHidden: true, showProxy: true }. This will show the full object including non-enumerable properties and proxies. |
|    %O:  | Object. A string representation of an object with generic JavaScript object formatting. Similar to util.inspect() without options. This will show the full object not including non-enumerable properties and proxies. |
|    %c:  | CSS. This specifier is ignored and will skip any CSS passed in. |
|    %%:  | single percent sign ('%'). This does not consume an argument. |

### Instruction for use


The use methods of each interface are as follows:

1.readonly encoding()
```
import util from '@ohos.util'
var textEncoder = new util.TextEncoder();
var getEncoding = textEncoder.encoding();
```
2.encode()
```
import util from '@ohos.util'
var textEncoder = new util.TextEncoder();
var result = textEncoder.encode('abc');
```
3.encodeInto()
```
import util from '@ohos.util'
var textEncoder = new util.TextEncoder();
var obj = textEncoder.encodeInto('abc', dest);
```
4.textDecoder()
```
import util from '@ohos.util'
var textDecoder = new util.textDecoder("utf-16be", {fatal : ture, ignoreBOM : false});
```
5.readonly encoding()
```
import util from '@ohos.util'
var textDecoder = new util.textDecoder("utf-16be", {fatal : ture, ignoreBOM : false});
var getEncoding = textDecoder.encoding();
```
6.readonly fatal()
```
import util from '@ohos.util'
var textDecoder = new util.textDecoder("utf-16be", {fatal : ture, ignoreBOM : false});
var fatalStr = textDecoder.fatal();
```
7.readonly ignoreBOM()
```
import util from '@ohos.util'
var textDecoder = new util.textDecoder("utf-16be", {fatal : ture, ignoreBOM : false});
var ignoreBom = textDecoder.ignoreBOM();
```
8.decode()
```
import util from '@ohos.util'
var textDecoder = new util.textDecoder("utf-16be", {fatal : ture, ignoreBOM : false});
var result = textDecoder.decode(input, {stream : true});
```
9.printf()
```
import util from '@ohos.util'
var format = "%%%o%%%i%s";
var value =  function aa(){};
var value1 = 1.5;
var value2 = "qwer";
var result = util.printf(format,value,value1,value2);
```
10.getErrorString()
```
import util from '@ohos.util'
var errnum = 13;
var result = util.getErrorString(errnum);
```
11.callbackWrapper()
```
import util from '@ohos.util'
async function promiseFn() {
    return Promise.resolve('value');
};
var cb = util.callbackWrapper(promiseFn);
cb((err, ret) => {
    expect(err).strictEqual(null);
    expect(ret).strictEqual('value');
})
```
12.promiseWrapper()
```
import util from '@ohos.util'
function aysnFun(str1, str2, callback) {
    if (typeof str1 === 'string' && typeof str1 === 'string') {
        callback(null, str1 + str2);
    } else {
        callback('type err');
    }
}
let newPromiseObj = util.promiseWrapper(aysnFun)("Hello", 'World');
newPromiseObj.then(res => {
    expect(res).strictEqual('HelloWorld');
})
```
## Related warehouse

[js_util_module subsystem](https://gitee.com/OHOS_STD/js_util_module)

[base/compileruntime/js_util_module/](base/compileruntime/js_util_module-readme.md)
