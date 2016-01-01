/**
 * ES6 Module
 * @author: SimonHao
 * @date:   2015-12-30 11:22:36
 */

'use strict';

class Human{
  constructor(){
    super()
  }
}

var Person = class Person extends Human{
  constructor(){
    super()
  }
  name(){
  }
  get name(){
  }
  set name(name){
  }
  static name(){
  }
  static get name(){
  }
  static set name(name){
  }
}


export var a = 1, name = function Name(){}, qq = class Person extends Person{}

export var a = 1, qq = 2, name = function(){};

export function name(){}
export class Person extends Human{

}

export {foo} from 'mod';
export {foo as Foo} from 'mod';
export {foo, bar} from 'mod';
export {foo as Foo, bar} from 'mod';

export {foo}
export {foo, bar};
export {foo as Foo, bar};

export default 1 + 1;
export default function name(){

}

export default function(){

}

export default name + 1;

export default class Person extends Human{

}

export default class extends Human{

}

import Module from 'made-module';
import * as MathLib from 'lib/math';
import {sum as SUM, pi} from 'lib/math';