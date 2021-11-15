# js_util_module Subsystems / components

-   [Introduction](#Introduction)
-   [Directory](#Directory)
-   [Description](#Description)
    -   [Interface description](#Interface description)
    -   [Instruction for use](#Instruction for use)

-   [Related warehouse](#Related warehouse)

## Introduction
The interface of util is used for character Textencoder, TextDecoder and HelpFunction module.The TextEncoder represents a text encoder that accepts a string as input, encodes it in UTF-8 format, and outputs UTF-8 byte stream. The TextDecoder interface represents a text decoder. The decoder takes the byte stream as the input and outputs the Stirng string. HelpFunction is mainly used to callback and promise functions, write and output error codes, and format class strings.
Encodes all bytes from the specified u8 array into a newly-allocated u8 array using the Base64 encoding scheme or Encodes the specified byte array into a String using the Base64 encoding scheme.Decodes a Base64 encoded String or input u8 array into a newly-allocated u8 array using the Base64 encoding scheme.The rational number is mainly to compare rational numbers and obtain the numerator and denominator.The LruBuffer algorithm replaces the least used data with new data when the buffer space is insufficient. The algorithm derives from the need to access resources: recently accessed data can be Will visit again in the near future. The least accessed data is the least valuable data that should be kicked out of the cache space. The Scope interface is used to describe the valid range of a field. The constructor for the Scope instance is used to create objects with specified lower and upper bounds and require that these objects be comparable.
## 目录

```
base/compileruntime/js_util_module/
├── Class:TextEncoder                   # TextEncoder class
│   ├──  new TextEncoder()              # create textencoder object
│   ├──  encode()                       # encode method
│   ├──  encoding                       # encoding property
│   └──  encodeInto()                   # encodeInto method
├── Class:TextDecoder                   # TextDecoder class
│   ├──  new TextDecoder()              # create TextDecoder object
│   ├──  decode()                       # decode method
│   ├──  encoding                       # encoding property
│   ├──  fatal	                        # fatal property
│   └──  ignoreBOM                     	# ignoreBOM property
├── printf()                            # printf method
├── getErrorString()                    # getErrorString method
├── callbackWrapper()                   # callbackWrapper method
├── promiseWrapper()                    # promiseWrapper method
├── Class:Base64                        # Base64 class
│   ├──  new Base64()                   # create Base64 object
│   ├──  encode()                       # encode method
│   ├──  encodeToString()               # encodeToString method
│   ├──  decode()                       # decode method
│   ├──  encodeAsync()                  # encodeAsync method
│   ├──  encodeToStringAsync()          # encodeToStringAsync method
│   └──  decodeAsync()                  # decodeAsync method
├── Class:RationalNumber                # RationalNumber class
│   ├──  new RationalNumber()           # create RationalNumber object
│   ├──  createRationalFromString()     # creatRationalFromString method
│   ├──  compareTo()                    # compareTo method
│   ├──  equals()                       # equals method
│   ├──  value()                        # value method
│   ├──  getCommonDivisor()             # getCommonDivisor method
│   ├──  getDenominator()               # getDenominator method
│   ├──  getNumerator()                 # getNumerator method
│   ├──  isFinite()                     # isFinite method
│   ├──  isNaN()                        # isNaN method
│   ├──  isZero()                       # isZero method
│   └──  toString()                     # toString method
├── Class:LruBuffer                     # LruBuffer class
│   ├──  new LruBuffer()                # create RationalNumber object
│   ├──  updateCapacity()               # updateCapacity method
│   ├──  toString()                     # toString method
│   ├──  values()                       # values method
│   ├──  size()                         # size method
│   ├──  capacity()                     # capacity method
│   ├──  clear()                        # clear method
│   ├──  getCreateCount                 # getCreateCount method
│   ├──  getMissCount()                 # getMissCount method
│   ├──  getRemovalCount()              # getRemovalCount method
│   ├──  getMatchCount()                # getMatchCount method
│   ├──  getPutCount()                  # getPutCount method
│   ├──  isEmpty()                      # isEmpty method
│   ├──  get()                          # get method
│   ├──  put()                          # put method
│   ├──  keys()                         # keys method
│   ├──  remove()                       # remove method
│   ├──  afterRemoval()                 # afterRemoval method
│   ├──  contains()                     # contains method
│   ├──  createDefault()                # createDefault method
│   ├──  entries()                      # entries method
│   └──  [Symbol.iterator]()            # Symboliterator method
└── Class:Scope                         # Scope class
    ├── constructor()                   # create Scope object
    ├── toString()                      # toString method
    ├── intersect()                     # intersect method
    ├── intersect()                     # intersect method
    ├── getUpper()                      # getUpper method
    ├── getLower()                      # getLower method
    ├── expand()                        # expand method 
    ├── expand()                        # expand method
    ├── expand()                        # expand method 
    ├── contains()                      # contains method
    ├── contains()                      # contains method
    └── clamp()                         # clamp method 
```

## Description

### Interface description
| Interface name | Description |
| -------- | -------- |
| readonly encoding : string | In the TextEncoder module, get the encoding format, only UTF-8 is supported. |
| encode(input : string) : Uint8Array | Input stirng string, encode and output UTF-8 byte stream. |
| encodeInto(input : string, dest : Uint8Array) : {read : number, written : number} | Enter the stirng string, dest represents the storage location after encoding, and returns an object, read represents the number of characters that have been encoded,and written represents the size of bytes occupied by the encoded characters. |
| constructor(encoding? : string, options? : {fatal? : boolean, ignoreBOM? : boolean}) | Constructor, the first parameter encoding indicates the format of decoding.The second parameter represents some attributes.Fatal in the attribute indicates whether an exception is thrown, and ignoreBOM indicates whether to ignore the bom flag. |
| readonly encoding : string | In the TextDecoder module, get the set decoding format. |
| readonly fatal : boolean | Get the setting that throws the exception. |
| readonly ignoreBOM : boolean | Get whether to ignore the setting of the bom flag. |
| decode(input : Uint8Array, options?: { stream?: false }) : string | Input the data to be decoded, and solve the corresponding string character string.The first parameter input represents the data to be decoded, and the second parameter options represents a bool flag, which means that additional data will be followed. The default is false. |
| encode(src: Uint8Array): Uint8Array; | Encodes all bytes in the specified u8 array into the newly allocated u8 array using the Base64 encoding scheme. |
| encodeToString(src: Uint8Array): string; | Encodes the specified byte array as a String using the Base64 encoding scheme. |
| decode(src: Uint8Array \| string): Uint8Array; | Decodes the Base64-encoded string or input u8 array into the newly allocated u8 array using the Base64 encoding scheme. |
| encodeAsync(src: Uint8Array): Promise\<Uint8Array\>; | Asynchronously encodes all bytes in the specified u8 array into the newly allocated u8 array using the Base64 encoding scheme. |
| encodeToStringAsync(src: Uint8Array): Promise\<string\>; | Asynchronously encodes the specified byte array into a String using the Base64 encoding scheme. |
| decodeAsync(src: Uint8Array \| string): Promise\<Uint8Array\>; | Use the Base64 encoding scheme to asynchronously decode a Base64-encoded string or input u8 array into a newly allocated u8 array. |
| static createRationalFromString(rationalString: string): RationalNumber | Create a RationalNumber object based on the given string. |
| compareTo(another: RationalNumber): number | Compare the current RationalNumber object with the given object. |
| equals(obj: object): number | Check if the given object is the same as the current RationalNumber object.|
| value(): number | Take the current RationalNumber object to an integer value or a floating point value. |
| static getCommonDivisor(number1: number, number2: number,): number | Obtain the greatest common divisor of two specified numbers. |
| getDenominator(): number | Get the denominator of the current RationalNumber object. |
| getNumerator(): number | Get the numerator of the current RationalNumber object. |
| isFinite(): boolean | Check that the current RationalNumber object is limited. |
| isNaN(): boolean | Check whether the current RationalNumber object represents a non-number (NaN) value. |
| isZero(): boolean | Check whether the current RationalNumber object represents a zero value. |
| toString(): string | Get the string representation of the current RationalNumber object. |
| constructor(capacity?: number) | The Create Default constructor is used to create a new LruBuffer instance with a default capacity of 64. |
| updateCapacity(newCapacity: number): void | Updates the buffer capacity to the specified capacity. This exception is thrown if newCapacity is less than or equal to 0. |
| toString(): string | Returns the string representation of the object and outputs the string representation of the object. |
| values(): V[ ] | Gets a list of all values in the current buffer, and the output returns a list of all values in the current buffer in ascending order, from most recently accessed to least recently accessed. |
| size(): number | Gets the total number of values in the current buffer. The output returns the total number of values in the current buffer. |
| capacity(): number | Gets the capacity of the current buffer. The output returns the capacity of the current buffer. |
| clear(): void | The key value pairs are cleared from the current buffer, after the key value is cleared, the afterRemoval () method is invoked to perform subsequent operations in turn. |
| getCreateCount(): number | Get the number of times the returned value of createdefault(), and output the number of times the returned value of createdefault(). |
| getMissCount(): number | Get the number of times the query value does not match, and output the number of times the query value does not match. |
| getRemovalCount(): number | Gets the number of evictions from the buffer, and outputs the number of evictions from the buffer. |
| getMatchCount​(): number | Obtain the number of successful matching of query values, and output the number of successful matching of query values. |
| getPutCount(): number | Gets the number of times the value was added to the buffer, and the output returns the number of times the value was added to the buffer. |
| isEmpty(): boolean | Checks whether the current buffer is empty and returns true if the current buffer does not contain any values. |
| get(key: K):V \| undefined | Indicates the key to query. If the specified key exists in the buffer, the value associated with the key will be returned; Otherwise, undefined is returned. |
| put(key: K, value: V): V | Adding the key value pair to the buffer and outputting the value associated with the added key; If the key to be added already exists, the original value is returned. If the key or value is empty, this exception is thrown. |
| keys(): K[ ] | Get the key list of the value in the current buffer, and the output returns the key list sorted from the most recent access to the least recent access. |
| remove​(key: K):V \| undefined | Deletes the specified key and its associated value from the current buffer. |
| afterRemoval(isEvict: boolean, key: K, value: V, newValue: V): void | Perform subsequent operations after deleting the value. |
| contains(key: K): boolean | Checks whether the current buffer contains the specified key, and returns true if the buffer contains the specified key. |
| createDefault(key: K): V | If the value of a specific key is not calculated, subsequent operations are performed. The parameter represents the missing key, and the output returns the value associated with the key. |
| entries(): [K,V] | Allows you to iterate over all key value pairs contained in this object. The keys and values of each pair are objects. |
| \[Symbol.iterator\](): [K,V]| Returns a two-dimensional array in the form of key value pairs. |
| constructor(lowerObj: ScopeType, upperObj: ScopeType) | Creates and returns a Scope object that creates a constructor for a scope instance that specifies a lower and upper bound. |
| toString():string | The stringification method returns a  string representation that contains the current range. |
| intersect(range: Scope): Scope | Gets the intersection of the given range and the current range. |
| intersect(lowerObj: ScopeType, upperObj: ScopeType): Scope | Gets the intersection of the current range with a given lower and upper bound range. |
| getUpper(): ScopeType | Gets the upper bound of the current scope. |
| getLower(): ScopeType | Gets the lower bound of the current scope. |
| expand(lowerObj: ScopeType, upperObj:  ScopeType): Scope | Creates and returns a union that includes the current range and a given lower and upper bound. |
| expand(range: Scope): Scope | Creates and returns a union that includes the current range and the given range. |
| expand(value: ScopeType): Scope | Creates and returns a union that includes the current range and the given value. |
| contains(value: ScopeType): boolean | Checks whether the given value is included in the current range. |
| contains(range: Scope): boolean | Checks whether the given range is within the current range. |
| clamp(value: ScopeType): ScopeType | Clips the specified value to the current range. |
| function printf(format: string, ...args: Object[]): string | The util.format() method returns a formatted string using the first argument as a printf-like format string which can contain zero or more format specifiers. |
| function getErrorString(errno: number): string |  The geterrorstring () method uses a system error number as a parameter to return system error information. |
| function callbackWrapper(original: Function): (err: Object, value: Object) => void | Takes an async function (or a function that returns a Promise) and returns a function following the error-first callback style, i.e. taking an (err, value) => ... callback as the last argument. In the callback, the first argument will be the rejection reason (or null if the Promise resolved), and the second argument will be the resolved value. |
| function promiseWrapper(original: (err: Object, value: Object) => void): Object | Takes a function following the common error-first callback style, i.e. taking an (err, value) => ... callback as the last argument, and returns a version that returns promises. |

Each specifier in printf is replaced with a converted value from the corresponding parameter. Supported specifiers are:
| Stylized character | Style requirements |
| -------- | -------- |
|    %s:  | String will be used to convert all values except BigInt, Object and -0. |
|    %d:  | Number will be used to convert all values except BigInt and Symbol. |
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
13.encode()
```
import util from '@ohos.util'
var that = new util.Base64();
var array = new Uint8Array([115,49,51]);
var result = that.encode(array);
```
14.encodeToString()
```
import util from '@ohos.util'
var that = new util.Base64();
var array = new Uint8Array([115,49,51]);
var result = that.encodeToString(array);
```
15.decode()
```
import util from '@ohos.util'
var that = new util.Base64()
var buff = 'czEz';
var result = that.decode(buff);
```
16.encodeAsync()
```
import util from '@ohos.util'
var that = new util.Base64()
var array = new Uint8Array([115,49,51]);
await that.encodeAsync(array).then(val=>{
})
done()
```
17.encodeToStringAsync()
```
import util from '@ohos.util'
var that = new util.Base64()
var array = new Uint8Array([115,49,51]);
await that.encodeToStringAsync(array).then(val=>{
})
done()
```
18.decodeAsync()
```
import util from '@ohos.util'
var that = new util.Base64()
var buff = 'czEz';
await that.decodeAsync(buff).then(val=>{
})
done()
```
19.createRationalFromString()
```
import util from '@ohos.util'
var pro = new util.RationalNumber(0, 0);
var res = pro.createRationalFromString("-1:2");
var result1 = res.value();
```
20.compareTo()
```
import util from '@ohos.util'
var pro = new util.RationalNumber(2, 1);
var proc = new util.RationalNumber(3, 4);
var res = pro.compareTo(proc);
```
21.equals()
```
import util from '@ohos.util'
var pro = new util.RationalNumber(2, 1);
var proc = new util.RationalNumber(3, 4);
var res = pro.equals(proc);
```
22.value()
```
import util from '@ohos.util'
var pro = new util.RationalNumber(2, 1);
var res = pro.value();
```
23.getCommonDivisor()
```
import util from '@ohos.util'
var pro = new util.RationalNumber(0, 0);
var res = pro.getCommonDivisor(4, 8);
```
24.getDenominator()
```
import util from '@ohos.util'
var pro = new util.RationalNumber(2, 1);
var res = pro.getDenominator();
```
25.getNumerator()
```
import util from '@ohos.util'
var pro = new util.RationalNumber(-2, 1);
var res = pro.getNumerator();
```
26.isFinite()
```
import util from '@ohos.util'
var pro = new util.RationalNumber(-2, 1);
var res = pro.isFinite();
```
27.isNaN()
```
import util from '@ohos.util'
var pro = new util.RationalNumber(-2, 1);
var res = pro.isNaN();
```
28.isZero()
```
import util from '@ohos.util'
var pro = new util.RationalNumber(-2, 1);
var res = pro.isZero();

```
29.toString()
```
import util from '@ohos.util'
var pro = new util.RationalNumber(-2, 1);
var res = pro.toString();

```
30.updateCapacity() 
```
import util from '@ohos.util'
var pro = new util.LruBuffer();
var result = pro.updateCapacity(100);
```
31.toString()
```
import util from '@ohos.util'
var pro = new util.LruBuffer();
pro.put(2,10);
pro.get(2);
pro.remove(20);
var result = pro.toString();
```
32.values()
```
import util from '@ohos.util'
var pro = new util.LruBuffer();
pro.put(2,10);
pro.put(2,"anhu");
pro.put("afaf","grfb");
var result = pro.values();
```
33.size()
```
import util from '@ohos.util'
var pro = new util.LruBuffer();
pro.put(2,10);
pro.put(1,8);
var result = pro.size();
```
34.capacity()
```
import util from '@ohos.util'
var pro = new util.LruBuffer();
var result = pro.capacity();
```
35.clear() 
```
import util from '@ohos.util'
var pro = new util.LruBuffer();
pro.put(2,10);
pro.clear();
```
36.getCreateCount()
```
import util from '@ohos.util'
var pro = new util.LruBuffer();
pro.put(1,8);
var result = pro.getCreateCount();
```
37.getMissCount()
```
import util from '@ohos.util'
var pro = new util.LruBuffer();
pro.put(2,10);
pro.get(2)
var result = pro.getMissCount();
```
38.getRemovalCount()
```
import util from '@ohos.util'
var pro = new util.LruBuffer();
pro.put(2,10);
pro.updateCapacity(2);
pro.put(50,22);
var result = pro.getRemovalCount();
```
39.getMatchCount()
```
import util from '@ohos.util'
var pro = new util.LruBuffer();
pro.put(2,10);
pro.get(2);
var result = pro.getMatchCount();
```
40.getPutCount()
```
import util from '@ohos.util'
var pro = new util.LruBuffer();
pro.put(2,10);
var result = pro.getPutCount();
```
41.isEmpty()
```
import util from '@ohos.util'
var pro = new util.LruBuffer();
pro.put(2,10);
var result = pro.isEmpty();
```
42.get()
```
import util from '@ohos.util'
var pro = new util.LruBuffer();
pro.put(2,10);
var result = pro.get(2);
```
43.put()
```
import util from '@ohos.util'
var pro = new util.LruBuffer();
var result = pro.put(2,10);
```
44.keys()
```
import util from '@ohos.util'
var pro = new util.LruBuffer();
pro.put(2,10);
var result = pro.keys();
```
45.remove()
```
import util from '@ohos.util'
var pro = new util.LruBuffer();
pro.put(2,10);
var result = pro.remove(20);
```
46.contains()
```
import util from '@ohos.util'
var pro = new util.LruBuffer();
pro.put(2,10);
var result = pro.contains(20);
```
47.createDefault()
```
import util from '@ohos.util'
var pro = new util.LruBuffer();
var result = pro.createDefault(50);
```
48.entries()
```
import util from '@ohos.util'
var pro = new util.LruBuffer();
pro.put(2,10);
var result = pro.entries();
```
49.\[Symbol.iterator\]()
```
import util from '@ohos.util'
var pro = new util.LruBuffer();
pro.put(2,10);
var result = pro[symbol.iterator]();
```
50.afterRemoval() 
```
import util from '@ohos.util'
var arr = [];
class ChildLruBuffer extends util.LruBuffer
{
    constructor()
    {
        super();
    }
    static getInstance()
    {
        if(this.instance ==  null)
        {
            this.instance = new ChildLruBuffer();
        }
        return this.instance;
    }
    afterRemoval(isEvict, key, value, newValue)
    {
        if (isEvict === false)
        {
            arr = [key, value, newValue];
        }
    }
}
ChildLruBuffer.getInstance().afterRemoval(false,10,30,null)
```
Construct a new class in the Scope interface to implement the compareTo method.

```
class Temperature {
    constructor(value) {
        this._temp = value;
    }
    compareTo(value) {
        return this._temp >= value.getTemp();
    }
    getTemp() {
        return this._temp;
    }
    toString() {
        return this._temp.toString();
    }
}
```
51.constructor()
```
var tempLower = new Temperature(30);
var tempUpper = new Temperature(40);
var range = new Scope(tempLower, tempUpper);
```
52.toString()
```
var tempLower = new Temperature(30);
var tempUpper = new Temperature(40);
var range = new Scope(tempLower, tempUpper);
var result = range.toString() // => [30,40]
```
53.intersect()
```
var tempLower = new Temperature(30);
var tempUpper = new Temperature(40);
var range = new Scope(tempLower, tempUpper);
var tempMiDF = new Temperature(35);
var tempMidS = new Temperature(39);
var rangeFir = new Scope(tempMiDF, tempMidS);
var result = range.intersect(rangeFir)  // => [35,39]
```
54.intersect()
```
var tempLower = new Temperature(30);
var tempUpper = new Temperature(40);
var tempMiDF = new Temperature(35);
var tempMidS = new Temperature(39);
var range = new Scope(tempLower, tempUpper);
var result = range.intersect(tempMiDF, tempMidS)  // => [35,39]
```
55.getUpper()
```
var tempLower = new Temperature(30);
var tempUpper = new Temperature(40);
var range = new Scope(tempLower, tempUpper);
var result = range.getUpper() // => 40
```
56.getLower()
```
var tempLower = new Temperature(30);
var tempUpper = new Temperature(40);
var range = new Scope(tempLower, tempUpper);
var result = range.getLower() // => 30
```
57.expand()
```
var tempLower = new Temperature(30);
var tempUpper = new Temperature(40);
var tempMiDF = new Temperature(35);
var tempMidS = new Temperature(39);
var range = new Scope(tempLower, tempUpper);
var result = range.expand(tempMiDF, tempMidS)  // => [30,40]
```
58.expand()
```
var tempLower = new Temperature(30);
var tempUpper = new Temperature(40);
var tempMiDF = new Temperature(35);
var tempMidS = new Temperature(39);
var range = new Scope(tempLower, tempUpper);
var rangeFir = new Scope(tempMiDF, tempMidS);
var result = range.expand(rangeFir) // => [30,40]
```
59.expand()
```
var tempLower = new Temperature(30);
var tempUpper = new Temperature(40);
var tempMiDF = new Temperature(35);
var range = new Scope(tempLower, tempUpper);
var result = range.expand(tempMiDF)  // => [30,40]
```
60.contains()
```
var tempLower = new Temperature(30);
var tempUpper = new Temperature(40);
var tempMiDF = new Temperature(35);
var range = new Scope(tempLower, tempUpper);
var result = range.contains(tempMiDF) // => true
```
61.contains()
```
var tempLower = new Temperature(30);
var tempUpper = new Temperature(40);
var range = new Scope(tempLower, tempUpper);
var tempLess = new Temperature(20);
var tempMore = new Temperature(45);
var rangeSec = new Scope(tempLess, tempMore);
var result = range.contains(rangeSec) // => true
```
62.clamp()
```
var tempLower = new Temperature(30);
var tempUpper = new Temperature(40);
var tempMiDF = new Temperature(35);
var range = new Scope(tempLower, tempUpper);
var result = range.clamp(tempMiDF) // => 35
```
## Related warehouse

[js_util_module subsystem](https://gitee.com/OHOS_STD/js_util_module)

[base/compileruntime/js_util_module/](base/compileruntime/js_util_module-readme.md)

