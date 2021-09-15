# js_util_module子系统/组件

-   [简介](#简介)
-   [目录](#目录)
-   [说明](#说明)
    -   [接口说明](#接口说明)
    -   [使用说明](#使用说明)

-   [相关仓](#相关仓)

## 简介

UTIL接口用于字符编码TextEncoder、解码TextDecoder和帮助函数HelpFunction。TextEncoder表示一个文本编码器，接受字符串作为输入，以UTF-8格式进行编码，输出UTF-8字节流。TextDecoder接口表示一个文本解码器，解码器将字节流作为输入，输出stirng字符串。HelpFunction主要是对函数做callback化、promise化以及对错误码进行编写输出，及类字符串的格式化输出。
## 目录

```
base/compileruntime/js_util_module/
├── Class:TextEncoder                   # TextEncoder类
│   ├──  new TextEncoder()             	# 创建TextEncoder对象
│   ├──  encode()                      	# encode方法
│   ├──  encoding                     	# encoding属性
│   └──  encodeInto()                   # encodeInto方法
├── Class:TextDecoder                   # TextDecoder类
│   ├──  new TextDecoder()              # 创建TextDecoder对象
│   ├──  decode()             		    # decode方法
│   ├──  encoding                      	# encoding属性
│   ├──  fatal	                     	# fatal属性
│   └──  ignoreBOM                     	# ignoreBOM属性
├── printf()			                # printf方法
├── getErrorString()			        # getErrorString方法
├── callbackWrapper()		            # callbackWrapper方法
└── promiseWrapper()		            # promiseWrapper方法
```

## 说明

### 接口说明


| 接口名 | 说明 |
| -------- | -------- |
| readonly encoding : string | 获取编码的格式，只支持UTF-8。 |
| encode(input : string) : Uint8Array | 输入stirng字符串，编码并输出UTF-8字节流。 |
| encodeInto(input : string, dest : Uint8Array) : {read : number, written : number} | 输入stirng字符串，dest表示编码后存放位置，返回一个对象，read表示已经编码的字符的个数，written表示已编码字符所占字节的大小。 |
| constructor(encoding? : string, options? : {fatal? : boolean, ignoreBOM? : boolean}) | 构造函数，第一个参数encoding表示解码的格式。第二个参数表示一些属性。属性中fatal表示是否抛出异常，ignoreBOM表示是否忽略bom标志。 |
| readonly encoding : string | 获取设置的解码格式。 |
| readonly fatal : boolean | 获取抛出异常的设置 |
| readonly ignoreBOM : boolean | 获取是否忽略bom标志的设置 |
| decode(input : ArrayBuffer | 输入要解码的数据，解出对应的string字符串。第一个参数input表示要解码的数据，第二个参数options表示一个bool标志，表示将跟随附加数据，默认为false。 |
| function printf(format: string, ...args: Object[]): string | printf()方法使用第一个参数作为格式字符串（其可以包含零个或多个格式说明符）来返回格式化的字符串。 |
| function getErrorString(errno: number): string | getErrorString()方法使用一个系统的错误数字作为参数，用来返回系统的错误信息。 |
| function callbackWrapper(original: Function): (err: Object, value: Object) => void | 参数为一个采用 async 函数（或返回 Promise 的函数）并返回遵循错误优先回调风格的函数，即将 (err, value) => ... 回调作为最后一个参数。 在回调中，第一个参数将是拒绝原因（如果 Promise 已解决，则为 null），第二个参数将是已解决的值。 |
| function promiseWrapper(original: (err: Object, value: Object) => void): Object |     参数为采用遵循常见的错误优先的回调风格的函数（也就是将 (err, value) => ... 回调作为最后一个参数），并返回一个返回 promise 的版本。 |

printf中每个说明符都替换为来自相应参数的转换后的值。 支持的说明符有:
| 式样化字符 | 式样要求 |
| -------- | -------- |
|    %s: | String 将用于转换除 BigInt、Object 和 -0 之外的所有值。|
|    %d: |Number 将用于转换除 BigInt 和 Symbol 之外的所有值。|
|    %i:  |parseInt(value, 10) 用于除 BigInt 和 Symbol 之外的所有值。|
|    %f:  |parseFloat(value) 用于除 Symbol 之外的所有值。|
|    %j:  |JSON。 如果参数包含循环引用，则替换为字符串 '[Circular]'。|
|    %o:  |Object. 具有通用 JavaScript 对象格式的对象的字符串表示形式。类似于具有选项 { showHidden: true, showProxy: true } 的 util.inspect()。这将显示完整的对象，包括不可枚举的属性和代理。|
|    %O:  |Object. 具有通用 JavaScript 对象格式的对象的字符串表示形式。类似于没有选项的 util.inspect()。 这将显示完整的对象，但不包括不可枚举的属性和代理。|
|    %c:  | 此说明符被忽略，将跳过任何传入的 CSS。|
|    %%:  |单个百分号 ('%')。 这不消耗待式样化参数。|

### 使用说明

各接口使用方法如下：

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
## 相关仓

[js_util_module子系统](https://gitee.com/OHOS_STD/js_util_module)

[base/compileruntime/js_util_module/](base/compileruntime/js_util_module-readme.md)
