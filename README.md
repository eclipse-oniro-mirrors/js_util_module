# js_util_module

#### 一、TextEncoder介绍

TextEncoder表示一个文本编码器，接受字符串作为输入，以UTF-8格式进行编码，输出UTF-8字节流。

接口介绍

1.readonly encoding : string

获取编码的格式，只支持UTF-8。

2.encode(input : string) : Uint8Array

输入stirng字符串，编码并输出UTF-8字节流。

3.encodeInto(input : string, dest : Uint8Array) : {read : number, written : number}

输入stirng字符串，dest表示编码后存放位置，返回一个对象，read表示已经编码的字符的个数，written表示已编码字符所占字节的大小。

使用方法:

import util from '@ohos.util'

var textEncoder = new util.TextEncoder();

var result = textEncoder.encode('abc');

var dest = new Uint8Array(6);

var obj = textEncoder.encodeInto('abc', dest);

var getEncoding = textEncoder.encoding();

#### 二、TextDecoder介绍

TextDecoder接口表示一个文本解码器，解码器将字节流作为输入，输出stirng字符串。

接口介绍

1.constructor(encoding? : string, options? : {fatal? : boolean, ignoreBOM? : boolean})
构造函数，第一个参数encoding表示解码的格式。

第二个参数表示一些属性。

属性中fatal表示是否抛出异常，ignoreBOM表示是否忽略bom标志。

2.readonly encoding : string

获取设置的解码格式

3.readonly fatal : boolean

获取抛出异常的设置

4.readonly ignoreBOM : boolean

获取是否忽略bom标志的设置

5.decode(input : ArrayBuffer | ArrayBufferView, options? : {stream? : false}) : string

输入要解码的数据，解出对应的string字符串。

第一个参数input表示要解码的数据，第二个参数options表示一个bool标志，表示将跟随附加数据，默认为false。

使用方法:

import util from '@ohos.util'

var textDecoder = new util.textDecoder("utf-16be", {fatal : ture, ignoreBOM : false});

var getEncoding = textDecoder.encoding();

var fatalStr = textDecoder.fatal();

var ignoreBom = textDecoder.ignoreBOM();

var input = new Uint8Array([96, 97, 98]);

var result = textDecoder.decode(input, {stream : true});

#### 三、helpfunction介绍

主要是对函数做callback化、promise化以及对错误码进行编写输出，及类字符串的格式化输出。

helpfunction模块，涉及4个接口。

接口介绍

1.function printf(format: string, ...args: Object[]): string;

    printf（）方法使用第一个参数作为格式字符串（其可以包含零个或多个格式说明符）来返回格式化的字符串。

每个说明符都替换为来自相应参数的转换后的值。 支持的说明符有：

    %s: String 将用于转换除 BigInt、Object 和 -0 之外的所有值。

    %d: Number 将用于转换除 BigInt 和 Symbol 之外的所有值。

    %i: parseInt(value, 10) 用于除 BigInt 和 Symbol 之外的所有值。

    %f: parseFloat(value) 用于除 Symbol 之外的所有值。

    %j: JSON。 如果参数包含循环引用，则替换为字符串 '[Circular]'。

    %o: Object. 具有通用 JavaScript 对象格式的对象的字符串表示形式。
    
        类似于具有选项 { showHidden: true, showProxy: true } 的 util.inspect()。

        这将显示完整的对象，包括不可枚举的属性和代理。

    %O: Object. 具有通用 JavaScript 对象格式的对象的字符串表示形式。

        类似于没有选项的 util.inspect()。 这将显示完整的对象，但不包括不可枚举的属性和代理。

    %c: CSS. 此说明符被忽略，将跳过任何传入的 CSS。

    %%: 单个百分号 ('%')。 这不消费参数。

    返回: <string> 格式化的字符串

    如果说明符没有相应的参数，则不会替换它：

         printf('%s:%s', 'foo');

        // 返回: 'foo:%s'

    如果其类型不是 string，则不属于格式字符串的值将进行%o类型的格式化。

    如果传给 printf（） 方法的参数多于说明符的数量，则额外的参数将以空格分隔串联到返回的字符串：

         printf('%s:%s', 'foo', 'bar', 'baz');

         // 返回: 'foo:bar baz'

    如果第一个参数不包含有效的格式说明符，则printf（）返回以空格分隔的所有参数的串联的字符串:

         printf(1, 2, 3);

        // 返回: '1 2 3'

    如果只有一个参数传给printf（），则它会按原样返回，不进行任何格式化：

         util.format('%% %s');

        // Returns: '%% %s'

2.function getErrorString(errno: number): string;

    getErrorString（）方法使用一个系统的错误数字作为参数，用来返回系统的错误信息。

3.function callbackWrapper(original: Function): (err: Object, value: Object) => void;

    参数为一个采用 async 函数（或返回 Promise 的函数）并返回遵循错误优先回调风格的函数，

    即将 (err, value) => ... 回调作为最后一个参数。 在回调中，第一个参数将是拒绝原因

    （如果 Promise 已解决，则为 null），第二个参数将是已解决的值。

4.function promiseWrapper(original: (err: Object, value: Object) => void): Object;

    参数为采用遵循常见的错误优先的回调风格的函数

    （也就是将 (err, value) => ... 回调作为最后一个参数），并返回一个返回 promise 的版本。

使用方法:

以printf、geterrorstring为例：

import util from '@ohos.util'

1.printf()

{
        var format = "%%%o%%%i%s";

        var value =  function aa(){};

        var value1 = 1.5;

        var value2 = "qwer";

        var result = util.printf(format,value,value1,value2);
}

2.geterrorstring()

{
        var errnum = 13;

        var result = util.geterrorstring(errnum);
}