/**
 * MadeScript Runtime
 * @author: SimonHao
 * @date:   2015-12-31 17:11:56
 */

'use strict';

/**
 * 创建 Class
 */
exports.create_class = function(constr, propertis, super_constr){
  var super_prototype = super_constr ? super_constr.prototype ? super_constr.prototype : null : null;

  constr.prototype = Object.create(super_prototype, {
    constructor: {
      value: constr,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  Object.defineProperties(constr.prototype, propertis[0]);
  Object.defineProperties(constr, propertis[1]);

  return constr;
};