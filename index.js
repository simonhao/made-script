/**
 * Made-Script
 * @author: SimonHao
 * @date:   2016-01-02 11:17:52
 */

'use strict';

var Compiler = require('./lib/compiler');
var fs       = require('fs');

/**
 * Compile Code
 * @param  {string} str      code source
 * @param  {string} filename code filename
 * @param  {object} options  setting
 * @return {string}          compile result
 */
exports.compile = function(str, filename, options){
  var compiler = new Compiler(str, filename, options);

  return compiler.compile();
};


/**
 * compile source file
 */
exports.compile_file = function(filename, options){
  var str = fs.readFileSync(filename, 'utf-8');

  return exports.compile(str, filename, options);
};