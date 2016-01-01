/**
 * Made Script Wrap
 * @author: SimonHao
 * @date:   2015-12-22 14:49:47
 */

require = (function(modules, entry){

  var prev_require = typeof require === 'function' && require;
  var cache = {};

  function new_require(module_id){
    var module;

    if(!cache[module_id]){
      if(!modules[module_id]){
        if(prev_require){
          return prev_require(module_id);
        }else{
          throw new Error('Cannot find module \'' + module_id + '\'');
        }
      }else{
        module = cache[module_id] = {exports:{}};
        modules[module_id].call(module.exports, new_require, module, module.exports);
      }
    }

    return cache[module_id].exports;
  }

  entry.forEach(function(module_id){
    new_require(module_id);
  });

  return new_require;
})({test:function(require, module, exports){/**
 * test
 * @author: SimonHao
 * @date:   2016-01-01 20:24:47
 */
'use strict';
var Human = __made.create_class(function Human(name) {
}, [
  {
    say: {
      value: function () {
        alert('human say');
      }
    }
  },
  {}
]);
var Person = __made.create_class(function Person(name, age) {
  Human.call(this, name, age);
}, [
  {
    say: {
      value: function () {
        console.log(Human.prototype.name);
        Human.prototype.say.call(this);
        alert('person hello');
      }
    },
    name: {
      get: function () {
        return this._name;
      },
      set: function (name) {
        this._name = name;
      }
    }
  },
  {
    life: {
      value: function () {
        alert('life');
      }
    },
    net: {
      get: function () {
        alert('net');
      }
    }
  }
], Human);
exports._default = Person;}},[])