/**
 * trans export
 * @author: SimonHao
 * @date:   2015-12-30 15:08:48
 */

'use strict';

module.exports = function(node, parent){
  if(node.type === 'ExportDefaultDeclaration'){
    return trans_default_declaration(node, parent);
  }

  if(node.type === 'ExportAllDeclaration'){
    return trans_all_declaration(node, parent);
  }

  if(node.type === 'ExportNamedDeclaration'){
    return trans_named_declaration(node, parent);
  }
};

function trans_default_declaration(node, parent){
  if(node.declaration.id){
    return {
      type: 'VariableDeclaration',
      declarations: [{
        type: 'VariableDeclarator',
        id: node.declaration.id,
        init: build_exports_expression('_default', node.declaration)
      }],
      kind: 'var'
    };
  }else{
    return {
      type: 'ExpressionStatement',
      expression: build_exports_expression('_default', node.declaration)
    };
  }
}

function trans_all_declaration(node, parent){
}

function trans_named_declaration(node, parent){

  if(node.source){
    return trans_source(node, parent);
  }

  if(node.declaration){
    return trans_declaration(node, parent);
  }

  return trans_specifiers(node, parent);
}


function trans_source(node, parent){
  var expression;

  if(node.specifiers.length === 1){
    expression = build_exports_require(node.specifiers[0].exported, node.source, node.specifiers[0].local);
  }else{
    expression = {
      type: 'SequenceExpression',
      expressions: node.specifiers.map(function(specifier){
        return build_exports_require(specifier.exported, node.source, specifier.local);
      })
    };
  }

  var express_statement = {
    type: 'ExpressionStatement',
    expression: expression
  };

  return express_statement;
}

function build_exports_require(property, module_id, module_property){
  return {
    type: 'AssignmentExpression',
    operator: '=',
    left: {
      type: 'MemberExpression',
      computed: false,
      object: {
        type: 'Identifier',
        name: 'exports'
      },
      property: property
    },
    right: {
      type: 'MemberExpression',
      computed: false,
      object: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'require'
        },
        arguments: [module_id]
      },
      property: module_property
    }
  };
}

function trans_declaration(node, parent){
  var declaration = {
    type: 'VariableDeclaration',
    declarations: [],
    kind: 'var'
  };

  if(node.declaration.type === 'VariableDeclaration'){
    declaration.declarations = node.declaration.declarations.map(function(declarator){
      return build_exports_declaration(declarator.id, declarator.init);
    });
  }else{
    declaration.declarations[0] = build_exports_declaration(node.declaration.id, node.declaration);
  }

  return declaration;
}

function build_exports_declaration(property, declaration){
  return {
    type: 'VariableDeclarator',
    id: property,
    init: build_exports_expression(property.name, declaration)
  };
}

function trans_specifiers(node, parent){
  var expression;

  if(node.specifiers.length === 1){
    expression = build_exports_expression(node.specifiers[0].exported.name, node.specifiers[0].local);
  }else{
    expression = {
      type: 'SequenceExpression',
      expressions: node.specifiers.map(function(specifier){
        return build_exports_expression(specifier.exported.name, specifier.local);
      })
    };
  }

  var express_statement = {
    type: 'ExpressionStatement',
    expression: expression
  };

  return express_statement;
}

var Declaration_Expression_Map = {
  'FunctionDeclaration' : 'FunctionExpression',
  'ClassDeclaration' : 'ClassExpression'
};

function build_exports_expression(property, declaration){

  if(declaration.type in Declaration_Expression_Map){
    declaration.type = Declaration_Expression_Map[declaration.type];
  }

  var assignment_expression = {
    type: 'AssignmentExpression',
    operator: '=',
    left: {
      type: 'MemberExpression',
      computed: false,
      object: {
        type: 'Identifier',
        name: 'exports'
      },
      property: {
        type: 'Identifier',
        name: property
      }
    },
    right: declaration
  };

  return assignment_expression;
}