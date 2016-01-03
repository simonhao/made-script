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
var options = {
  basedir: __dirname,
  with_dep: true,
  transform:[function(node, parent, options){
    if(node.type === 'CallExpression' && node.callee.name === '__class' && node.arguments.length === 1 && node.arguments[0].type === 'Literal'){
      return node.arguments[0];
    }
  }]
};

var compiler = new Compiler(str, filename, options)

var result = compiler.compile();

fs.writeFileSync(__dirname + '/test.compile.js', result);