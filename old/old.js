/**
 * Made-Script
 * @author: SimonHao
 * @date:   2015-12-22 17:23:52
 */

'use strict';

var ScriptPack = require('./lib/pack');
var mid        = require('made-id');
var extend     = require('extend');

var default_func = {
  __class: function(args, options){
    var name = args[0];
    var sid = options.sid;

    return {
      "type": "Literal",
      "value": '.' + (sid ? sid + '-' : '') + name,
      "raw": "'." + (sid ? sid + '-' : '') + name + "'"
    };
  },
  __id: function(args, options){
    var name = args[0];
    var sid = options.sid;

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
  },
  __instance: function(args, options){
    var name = args[0];
    var sid = options.sid;

    var ast = {
      "type": "BinaryExpression",
      "operator": "+",
      "left": {
        "type": "Literal",
        "value": sid,
        "raw": "'" + sid + "'"
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
            "type": "Literal",
            "value": "-",
            "raw": "'-'"
          },
          "right": {
            "type": "Identifier",
            "name": "instance"
          }
        },
        "alternate": {
          "type": "Literal",
          "value": "",
          "raw": "''"
        }
      }
    };

    if(name){
      return {
        "type": "BinaryExpression",
        "operator": "+",
        "left": ast,
        "right":{
          "type": "Literal",
          "value": '-' + name,
          "raw": "'" + "-" + name + "'"
        }
      }
    }else{
      return ast;
    }
  }
};

module.exports = function(options){
  var _entry = options.entry || [];
  var _require = options.require || [];
  var _external = options.external || [];

  var func_list = Object.create(default_func);

  if(typeof options.func === 'object'){
    Object.keys(options.func).forEach(function(func_name){
      func_list[func_name] = function(args, opt){
        var result = options.func[func_name](args, opt);

        return {
          "type": "Literal",
          "value": result,
          "raw": "'" + result + "'"
        };
      };
    });
  }

  var pack = new ScriptPack({
    basedir: options.basedir,
    func: func_list,
    transform: options.transform || {}
  });

  pack.add(_entry);
  pack.require(_require);
  pack.external(_external);

  return pack.bundle();
};

exports.Pack = ScriptPack;

