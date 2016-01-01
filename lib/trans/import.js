/**
 * trans import
 * @author: SimonHao
 * @date:   2015-12-30 11:49:25
 */

'use strict';

module.exports = function(node, parent){
  if(node.type !== 'ImportDeclaration') return;

  var declaration_node = {
    type: 'VariableDeclaration',
    declarations: [],
    kind: 'var'
  };

  declaration_node.declarations = node.specifiers.map(function(specifier){
    switch (specifier.type){
      case 'ImportDefaultSpecifier' :
        return trans_default_specifier(specifier, node.source);
      case 'ImportNamespaceSpecifier' :
        return trans_namespace_specifier(specifier, node.source);
      case 'ImportSpecifier' :
        return trans_specifier(specifier, node.source);
    }
  });

  return declaration_node;
};

function trans_default_specifier(node, source){
  return build_require_declarator(node.local.name, source.value, '_default');
}

function trans_namespace_specifier(node, source){
  return build_require_declarator(node.local.name, source.value);
}

function trans_specifier(node, source){
  return build_require_declarator(node.local.name, source.value, node.imported.name);
}

function build_require_declarator(id, module_id, property){
  var variable_declarator = {
    type: 'VariableDeclarator',
    id: {
      type: 'Identifier',
      name: id
    }
  };

  if(property){
    variable_declarator.init = {
      type: 'MemberExpression',
      computed: false,
      object: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'require'
        },
        arguments:[{
          type: 'Literal',
          value: module_id,
          raw: "'" + module_id + "'"
        }]
      },
      property: {
        type: 'Identifier',
        name: property
      }
    };
  }else{
    variable_declarator.init = {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: 'require'
      },
      arguments: [{
        type: 'Literal',
        value: module_id,
        raw: "'" + module_id + '"'
      }]
    };
  }

  return variable_declarator;
}
