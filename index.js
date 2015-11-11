/**
 * Made-Script
 * @author: SimonHao
 * @date:   2015-11-11 14:06:44
 */

'use strict';

var esprima    = require('esprima');
var estraverse = require('estraverse');
var escodegen  = require('escodegen');
var mid        = require('made-id');
var extend     = require('extend');
var fs         = require('fs');

module.exports = function(filename, options, transform){
  var options = extend({
    basedir: '/',
    entry: 'index.js',
    ext: '.js'
  }, options);

  var transform = transform || {};

  var id  = mid.id(filename, options);
  var sid = mid.sid(filename, options);

  var str = fs.readFileSync(filename, 'utf-8');
  var ast = esprima.parse(str, {
    attachComment: true
  });

  var result = estraverse.replace(ast, {
    leave: function(node, parent){
      if(node.type === 'Identifier' && node.name === '__module_id'){
        return __module_id(id);
      }else if(node.type === 'CallExpression' && node.callee.type === 'Identifier'){
        if(node.callee.name === '__class'){

          return __class(sid, node.arguments[0].value);
        }else if(node.callee.name === '__id'){

          return __id(sid, node.arguments[0].value);
        }else if(node.callee.name === '__instance'){

          return __instance(sid, node.arguments[0].value);
        }else if(node.callee.name in transform){

          return __transform(transform[node.callee.name](node.arguments.map(function(node){
            return node.value
          })));
        }
      }
    }
  });

  return escodegen.generate(result, {
    format: {
      indent: {
        adjustMultilineComment: true
      }
    },
    comment: true
  });
};


function __module_id(id){
  return {
    "type": "Literal",
    "value": id,
    "raw": "'" + id + "'"
  };
}

function __class(sid, name){
  return {
    "type": "Literal",
    "value": '.' + (sid ? sid + '-' : '') + name,
    "raw": "'." + (sid ? sid + '-' : '') + name + "'"
  };
}

function __id(sid, name){
  return {
    "type": "BinaryExpression",
    "operator": "+",
    "left": {
      "type": "BinaryExpression",
      "operator": "+",
      "left": {
        "type": "Literal",
        "value": '#' + (sid ? sid + '-' : ''),
        "raw": "'#" + (sid ? sid + '-' : '') + "'"
      },
      "right": {
        "type": "ConditionalExpression",
        "test": {
          "type": "Identifier",
          "name": "instance"
        },
        "consequent": {
          "type": "BinaryExpression",
          "operator": "+",
          "left": {
            "type": "Identifier",
            "name": "instance"
          },
          "right": {
            "type": "Literal",
            "value": "-",
            "raw": "'-'"
          }
        },
        "alternate": {
          "type": "Literal",
          "value": "",
          "raw": "''"
        }
      }
    },
    "right": {
      "type": "Literal",
      "value": name,
      "raw": "'" + name + "'"
    }
  };
}

function __instance(sid, name){
  return {
    "type": "BinaryExpression",
    "operator": "+",
    "left": {
      "type": "BinaryExpression",
      "operator": "+",
      "left": {
        "type": "Literal",
        "value": (sid ? sid + '-' : ''),
        "raw": "'" + (sid ? sid + '-' : '') + "'"
      },
      "right": {
        "type": "ConditionalExpression",
        "test": {
          "type": "Identifier",
          "name": "instance"
        },
        "consequent": {
          "type": "BinaryExpression",
          "operator": "+",
          "left": {
            "type": "Identifier",
            "name": "instance"
          },
          "right": {
            "type": "Literal",
            "value": "-",
            "raw": "'-'"
          }
        },
        "alternate": {
          "type": "Literal",
          "value": "",
          "raw": "''"
        }
      }
    },
    "right": {
      "type": "Literal",
      "value": name,
      "raw": "'" + name + "'"
    }
  };
}

function __transform(result){
  return {
    "type": "Literal",
    "value": result,
    "raw": "'" + result + "'"
  };
}