/**
 * Made Script Pack
 * @author: SimonHao
 * @date:   2015-12-22 09:43:34
 */

'use strict';

var extend     = require('extend');
var path       = require('path');
var mid        = require('made-id');
var fs         = require('fs');
var esprima    = require('esprima');
var estraverse = require('estraverse');
var escodegen  = require('escodegen');

function ScriptPack(options){
  this.options = extend({
    basedir: process.cwd(),
    entry: 'index.js',
    ext: '.js',
    transform: {},
    func: {}
  }, options);

  this.transform = this.options.transform;
  this.func = this.options.func;

  this._entry    = {};
  this._external = {};
  this._require  = {};

  this._bundle = {};
}

ScriptPack.prototype = {
  constructor: ScriptPack,
  error: function(){
    console.error(Array.prototype.slice.call(arguments).join(''));
  },
  add: function(file){
    var self = this;

    if(Array.isArray(file)){
      file.forEach(function(f){
        self.add(f);
      });
      return;
    }

    var filename = this.require(file);

    if(filename){
      this._entry[filename] = true;
    }
  },
  require: function(file){
    var self = this;

    if(Array.isArray(file)){
      file.forEach(function(f){
        self.require(f);
      });
      return;
    }

    var filename;

    if(path.isAbsolute(file)){
      filename = file;
    }else{
      filename = mid.path(file, this.options);
    }

    if(fs.existsSync(filename) && fs.statSync(filename).isFile()){
      this._require[filename] = true;

      return filename;
    }else{
      self.error('Cont find require module "', file, '"');
    }
  },
  external: function(file){
    var self = this;

    if(Array.isArray(file)){
      file.forEach(function(f){
        self.external(f);
      });
      return;
    }

    var filename;

    if(path.isAbsolute(file)){
      filename = file;
    }else{
      filename = mid.path(file, this.options);
    }

    if(fs.existsSync(filename) && fs.statSync(filename).isFile()){
      this._deps(filename);
    }else{
      self.error('Cont find external module "', file, '"');
    }
  },
  _ast: function(filename, str, has_comment){
    try{
      var ast = esprima.parse(str, {
        attachComment: has_comment
      });

      return ast;
    }catch(err){
      this.error('Synatx Error: "', filename, '"');
    }
  },
  _str: function(filename){
    var extname = path.extname(filename).substring(1);
    var str;

    if(extname in this.transform){
      str = this.transform[extname](filename);
    }else{
      str = fs.readFileSync(filename, 'utf-8');
    }

    return str;
  },
  _not_external_module: function(filename){
    return path.relative(this.options.basedir, filename)[0] !== '.';
  },
  _check_function: function(node, options){
    var options = extend({
      sid: mid.sid(options.filename, options)
    }, options);

    if(node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name in this.func){
      return this.func[node.callee.name].call(node, node.arguments.map(function(node){return node.value}), options);
    }
  },
  _check_require: function(node){
    if(node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'require'){
      if(node.arguments.length && node.arguments[0].type === 'Literal'){
        return node.arguments[0].value;
      }
    }
  },
  _build_require: function(module_id){
    return {
      "type": "CallExpression",
      "callee": {
        "type": "Identifier",
        "name": "require"
      },
      "arguments": [
        {
          "type": "Literal",
          "value": module_id,
          "raw": "'" + module_id + "'"
        }
      ]
    };
  },
  _deps: function(filename){
    var self = this;

    if(filename in self._external) return;

    var str = this._str(filename);
    var ast = this._ast(filename, str);

    var options = {
      filename: filename,
      basedir: this.options.basedir,
      entry: this.options.entry,
      ext: this.options.ext
    };

    this._external[filename] = true;

    estraverse.replace(ast, {
      leave: function(node, parent){
        var module_id, module_path;

        module_id = self._check_require(node);

        if(module_id){
          module_path = mid.path(module_id, options);

          if(module_path){
            self._deps(module_path);
          }else{
            self.error('Cont find module "', module_id, '" from file "', filename, '"');
          }
        }
      }
    });
  },
  bundle: function(){
    var self = this;

    Object.keys(this._require).forEach(function(filename){
      self._compile(filename);
    });

    var bundle = [];

    bundle.push(fs.readFileSync(__dirname + '/wrap.js', 'utf-8'));
    bundle.push('({');

    bundle.push(Object.keys(this._bundle).map(function(filename){
      var module_id = mid.id(filename, {
        basedir: self.options.basedir,
        entry: 'index.js',
        ext: '.js'
      });

      return [JSON.stringify(module_id),': function(require, module, exports){\n', self._bundle[filename] ,'\n}'].join('');

    }).join(','));

    bundle.push('},');
    bundle.push('[');

    bundle.push(Object.keys(this._entry).map(function(filename){
      return JSON.stringify(mid.id(filename, {
        basedir: self.options.basedir,
        entry: 'index.js',
        ext: '.js'
      }));
    }).join(','));

    bundle.push(']);');

    return bundle.join('');
  },
  _compile: function(filename){
    var self = this;

    if(filename in this._bundle || filename in this._external) return;

    var str = this._str(filename);
    var ast = this._ast(filename, str, true);

    var options = {
      filename: filename,
      basedir: this.options.basedir,
      entry: this.options.entry,
      ext: this.options.ext
    };
    var deps = [];

    var not_external_module = this._not_external_module(filename);

    var result = estraverse.replace(ast, {
      leave: function(node, parent){
        var module_id, module_path;

        module_id = self._check_require(node);

        if(module_id){
          module_path = mid.path(module_id, options);

          if(module_path){
            deps.push(module_path);

            return self._build_require(mid.id(module_path, options));
          }else{
            self.error('Cont find module "', module_id, '" from file "', filename, '"');
          }
        }else if(not_external_module){
          return self._check_function(node, options);
        }
      }
    });

    this._bundle[filename] = escodegen.generate(result, {
      format: {
        indent: {
          adjustMultilineComment: true
        }
      },
      comment: true
    });

    deps.forEach(function(filename){
      self._compile(filename);
    });
  }
};

module.exports = ScriptPack;