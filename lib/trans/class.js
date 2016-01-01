/**
 * trans class
 * @author: SimonHao
 * @date:   2015-12-31 11:15:20
 */

'use strict';

var estraverse = require('estraverse');

module.exports = function(node, parent){
  if(node.type === 'ClassExpression'){
    return trans_class_expression(node, parent);
  }

  if(node.type === 'ClassDeclaration'){
    return trans_class_declaration(node, parent);
  }
};

function trans_class_expression(node, parent){
  return build_create_class_expression(node);
}

function trans_class_declaration(node, parent){
  return {
    type: 'VariableDeclaration',
    declarations: [{
      type: 'VariableDeclarator',
      id: node.id,
      init: build_create_class_expression(node)
    }],
    kind: 'var'
  };
}

function build_create_class_expression(class_node){
  var node = estraverse.replace(class_node, {
      enter: function(node, parent){
        return trans_super(node, parent, class_node.superClass);
      }
    });

  var create_class = {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      computed: false,
      object: {
        type: 'Identifier',
        name: '__made'
      },
      property: {
        type: 'Identifier',
        name: 'create_class'
      }
    },
    arguments: []
  };

  var proto_property  = {};
  var static_property = {};

  node.body.body.forEach(function(method){
    if(method.static){
      add_property_kind(static_property, method);
    }else if(method.kind === 'constructor'){
      method.value.id = node.id;
      create_class.arguments.push(method.value);
    }else{
      add_property_kind(proto_property, method);
    }
  });

  var property = {
    type: 'ArrayExpression',
    elements: []
  };

  property.elements.push({
    type: 'ObjectExpression',
    properties: build_property(proto_property)
  });

  property.elements.push({
    type: 'ObjectExpression',
    properties: build_property(static_property)
  });

  create_class.arguments.push(property);

  if(node.superClass){
    create_class.arguments.push(node.superClass);
  }

  return create_class;
}

function build_property(property_table){
  var properties = [];

  Object.keys(property_table).forEach(function(property_name){
    properties.push({
      type: 'Property',
      key: {
        type: 'Identifier',
        name: property_name
      },
      computed: false,
      value: build_property_value(property_table[property_name]),
      kind: 'init',
      method: false,
      shorthand: false
    });
  });

  return properties;
}

function build_property_value(property){
  var property_value = {
    type: 'ObjectExpression',
    properties: []
  };

  Object.keys(property).forEach(function(property_kind){
    property_value.properties.push({
      type: 'Property',
      key: {
        type: 'Identifier',
        name: property_kind
      },
      computed: false,
      value: property[property_kind],
      kind: 'init',
      method: false,
      shorthand: false
    });
  });

  return property_value;
}

function add_property_kind(target, node){
  target[node.key.name] = target[node.key.name] || {};

  switch(node.kind){
    case 'method' :
      target[node.key.name].value = node.value;
      break;
    case 'get' :
      target[node.key.name].get = node.value;
      break;
    case 'set' :
      target[node.key.name].set = node.value;
      break;
  }
}

function trans_super(node, parent, super_class){
  if(node.type === 'CallExpression' && node.callee.type === 'Super'){
    return trans_super_call(node, parent, super_class);
  }

  if(node.type === 'CallExpression' && node.callee.type === 'MemberExpression' && node.callee.object.type === 'Super'){
    return trans_super_proto_call(node, parent, super_class);
  }

  if(node.type === 'Super'){
    return trans_super_proto_reference(node, parent, super_class);
  }
}

function trans_super_call(node, parent, super_class){
  node.arguments.unshift({
    type: 'ThisExpression'
  });

  node.callee = {
    type: 'MemberExpression',
    computed: false,
    object: super_class,
    property: {
      type: 'Identifier',
      name: 'call'
    }
  };
}

function trans_super_proto_reference(node, parent, super_class){
  return {
    type: 'MemberExpression',
    computed: false,
    object: super_class,
    property: {
      type: 'Identifier',
      name: 'prototype'
    }
  };
}

function trans_super_proto_call(node, parent, super_class){
  node.callee.object = {
    type: 'MemberExpression',
    object: {
      type: 'Super'
    },
    property: node.callee.property
  };

  node.callee.property = {
    type: 'Identifier',
    name: 'call'
  };

  node.arguments.unshift({
    type: 'ThisExpression'
  });
}


