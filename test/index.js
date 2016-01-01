/**
 * test
 * @author: SimonHao
 * @date:   2015-12-29 15:29:37
 */

'use strict';

var Compiler = require('../lib/compiler');
var fs       = require('fs');

var filename = __dirname + '/test.js';
var str      = fs.readFileSync(filename, 'utf-8');

var compiler = new Compiler(str, filename)

var result = compiler.compile();

console.log(result);

var wrapfile = __dirname + '/../old/wrap.js';
var wrap = fs.readFileSync(wrapfile, 'utf-8');

result = wrap + '({test:function(require, module, exports){' + result + '}},[])';

fs.writeFileSync(__dirname + '/test.compile.js', result);