# js_ util_ module

####1、 Introduction to helpfunction

It is mainly used to callback and promise functions, output error code information, and format a printf-like string.

The helpfunction module involves four interfaces.

Interface introduction:

1.function printf(format: string, ...args: Object[]): string;

        The util.format() method returns a formatted string using the first argument as a printf-like format string which can contain zero or more format specifiers. Each specifier is replaced with the converted value from the corresponding argument. Supported specifiers are:
        Each specifier is replaced with a converted value from the corresponding parameter. Supported specifiers are:
        %s: String will be used to convert all values except BigInt, Object and -0. BigInt values will be represented with an n and Objects that have no user defined toString function are inspected using util.inspect() with options { depth: 0, colors: false, compact: 3 }.
        %d: Number will be used to convert all values except BigInt and Symbol.
        %i: parseInt(value, 10) is used for all values except BigInt and Symbol.
        %f: parseFloat(value) is used for all values expect Symbol.
        %j: JSON. Replaced with the string '[Circular]' if the argument contains circular references.
        %o: Object. A string representation of an object with generic JavaScript object formatting. Similar to util.inspect() with options { showHidden: true, showProxy: true }. This will show the full object including non-enumerable properties and proxies.
        %O: Object. A string representation of an object with generic JavaScript object formatting. Similar to util.inspect() without options. This will show the full object not including non-enumerable properties and proxies.
        %c: CSS. This specifier is ignored and will skip any CSS passed in.
        %%: single percent sign ('%'). This does not consume an argument.
        Returns: <string> The formatted string
        If a specifier does not have a corresponding argument, it is not replaced:
        util.format('%s:%s', 'foo');
        // Returns: 'foo:%s'

        Values that are not part of the format string are formatted using util.inspect() if their type is not string.
        If there are more arguments passed to the util.format() method than the number of specifiers, the extra arguments are         concatenated to the returned string, separated by spaces:
        util.format('%s:%s', 'foo', 'bar', 'baz');
        // Returns: 'foo:bar baz'

        If the first argument does not contain a valid format specifier, util.format() returns a string that is the concatenation of all         arguments separated by spaces:
        util.format(1, 2, 3);
        // Returns: '1 2 3'

        If only one argument is passed to util.format(), it is returned as it is without any formatting:
        util.format('%% %s');
        // Returns: '%% %s'

2.function getErrorString(errno: number): string;

        The geterrorstring () method uses a system error number as a parameter to return system error information.

3.function callbackWrapper(original: Function): (err: Object, value: Object) => void;

        Takes an async function (or a function that returns a Promise) and returns a function following the error-first callback style, i.e. taking an (err, value) => ... callback as the last argument. In the callback, the first argument will be the rejection reason (or null if the Promise resolved), and the second argument will be the resolved value.

4.function promiseWrapper(original: (err: Object, value: Object) => void): Object;

        Takes a function following the common error-first callback style, i.e. taking an (err, value) => ... callback as the last argument, and returns a version that returns promises.

####2、 Method of use

Take printf and geterrorstring as examples:

1.printf() 

{

        var format = "%%%o%%%i%s";

        var value =  function aa(){};

        var value1 = 1.5;

        var value2 = "qwer";

        var result = util.printf(format,value,value1,value2);

        console.log("-----SK-----printf---result---+["  +result +"]");
        
}

2.geterrorstring() 

{

        var errnum = 13;

        var result = util.geterrorstring(errnum);

        console.log("-----SK------  = " + result);
        
}