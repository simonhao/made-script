var __made_script = require("made-script");
/**
 * test
 * @author: SimonHao
 * @date:   2016-01-01 20:24:47
 */
'use strict';
var Module = require('made-module')._default;
var MathLib = require('comm/math');
var Max = require('comm/math').max, min = require('comm/math').min;
var SyncModule = require('made-sync-module');
var class_name = '.test-class_name';
var Human = __made_script.create_class(function Human(name) {
  this._name = name;
}, [
  {
    say: {
      value: function () {
        this._say = true;
        alert('human say');
      }
    }
  },
  {}
], Module);
var Person = __made_script.create_class(function Person(name, age) {
  Human.call(this, name);
  this._age = age;
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
exports._default = Person;