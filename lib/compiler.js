/**
 * compile es6 module
 * @author: SimonHao
 * @date:   2015-12-29 16:38:10
 */

'use strict';

var esprima    = require('esprima');
var extend     = require('extend');
var estraverse = require('estraverse');
var escodegen  = require('escodegen');
var mid        = require('made-id');

var trans_import = require('./trans/import');
var trans_export = require('./trans/export');
var trans_class  = require('./trans/class');

function Compiler(str, filename, options){
  this.filename = filename;

  this.options = extend({
    basedir: process.cwd(),
    entry: 'index.js',
    ext: '.js',
    transform: []
  }, options);

  this.transform = this.options.transform;

  try{
    this.ast = esprima.parse(str, {
      attachComment: true,
      sourceType: 'module'
    });
  }catch(err){
    this.error('Synatx Error: "', filename, '"');
    this.error(err.toString());
  }
}

Compiler.prototype = {
  constructor: Compiler,
  error: function(){
    console.error.apply(arguments, arguments);
  },
  compile: function(){
    var self = this;

    var result = estraverse.replace(this.ast, {
      enter: function(node, parent){
        return self.translate(node, parent);
      }
    });

    var code = escodegen.generate(result, {
      format: {
        indent: {
          style: '  ',
          adjustMultilineComment: true
        }
      },
      comment: true
    });

    return code;
  },
  trans: function(node, parent){
    var transform = this.transform;
    var options = {
      basedir: this.options.basedir,
      filename: this.filename,
      entry: this.options.entry,
      ext: this.options.ext
    };

    var result;

    for(var i = 0; i < transform.length; i++){
      result = transform[i](node, parent, options);

      if(result) return result;
    }
  },
  translate: function(node, parent){
    return trans_import(node, parent)
      || trans_export(node, parent)
      || trans_class(node, parent)
      || this.trans(node, parent);
  }
};



module.exports = Compiler;