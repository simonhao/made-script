/**
 * trnas made module class_name, id, instance
 * @author: SimonHao
 * @date:   2016-01-04 14:05:29
 */

'use strict';

var mid = require('made-id');

module.exports = function(node, parent, sid){
  if(node.type !== 'CallExpression') return;

  if(node.callee.name === '__class'){
    return trans_class_name(node, parent, sid);
  }

  if(node.callee.name === '__id'){
    return trans_id(node, parent, sid);
  }

  if(node.callee.name === '__instance'){
    return trans_instance(node, parent, sid);
  }
};



function trans_class_name(node, parent, sid){
  var class_name = '.' + (sid ? sid + '-' : '') + node.arguments[0].value;

  return {
    type: 'Literal',
    value: class_name,
    raw: '"' + class_name + '"'
  };
}

function trans_id(node, parent, sid){
  var id = '#' + (sid ? sid + '-' : '');

  return {
    type: 'BinaryExpression',
    operator: '+',
    left:{
      type: 'BinaryExpression',
      operator: '+',
      left:{
        type: 'Literal',
        value: id,
        raw: '"' + id + '"'
      },
      right:{
        type: 'ConditionalExpression',
        test: {
          type: 'Identifier',
          name: 'instance'
        },
        consequent: {
          type: 'BinaryExpression',
          operator: '+',
          left: {
            type: 'Identifier',
            name: 'instance'
          },
          right:{
            type: 'Literal',
            value: '-',
            raw: '"-"'
          }
        },
        alternate: {
          type: 'Literal',
          value: '',
          raw: '""'
        }
      }
    },
    right:{
      type: 'Literal',
      value: node.arguments[0].value,
      raw: '"' + node.arguments[0].value + '"'
    }
  };
}

function trans_instance(node, parent, sid){
  var name = node.arguments && node.arguments.length && (node.arguments[0].value || node.arguments[0].name);
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














