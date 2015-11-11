/**
 * 测试
 * @author: SimonHao
 * @date:   2015-11-11 16:31:45
 */

'use strict';

var fs = require('fs');
var compiler = require('../index.js');

var filename = __dirname + '/code.js';
var options = {
  basedir: __dirname,
};

var transform = {
  __src: function(args){
    return 'this will replace by path:' + args.join(',');
  }
};

console.log(compiler(filename, options, transform));

