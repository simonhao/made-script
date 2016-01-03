/**
 * test
 * @author: SimonHao
 * @date:   2016-01-01 20:24:47
 */

'use strict';

import Module from 'made-module';
import * as MathLib from 'comm/math';
import {max as Max, min} from 'comm/math';

var SyncModule = require('made-sync-module');

var class_name = __class('class_name');

class Human extends Module{
  constructor(name){
    this._name = name;
  }
  say(){
    this._say = true;
    alert('human say');
  }
}

class Person extends Human{
  constructor(name, age){
    super(name);
    this._age = age;
  }
  say(){
    console.log(super.name);
    super.say();
    alert('person hello');
  }
  get name(){
    return this._name;
  }
  set name(name){
    this._name = name;
  }
  static life(){
    alert('life')
  }
  static get net(){
    alert('net');
  }
}

export default Person;