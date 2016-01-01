/**
 * test
 * @author: SimonHao
 * @date:   2016-01-01 20:24:47
 */

'use strict';

class Human{
  constructor(name){

  }
  say(){
    alert('human say');
  }
}

class Person extends Human{
  constructor(name, age){
    super(name, age);
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