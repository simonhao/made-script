/**
 * 测试
 * @author: SimonHao
 * @date:   2015-11-11 16:31:45
 */

'use strict';

var ScriptPack = require('../lib/pack');
var pack_script = require('../index.js');
var fs = require('fs');

var func = {
  __src: function(args, options){
    return args[0] + 'this is transform';
  }
};

var comm = pack_script({
  basedir: __dirname,
  add: ['comm/fetch', 'instance'],
  require: ['base/net', 'base/query', 'base/extend']
});

fs.writeFileSync(__dirname + '/comm.js', comm);


var bundle = pack_script({
  basedir: __dirname,
  require: ['code'],
  func: func,
  external: ['base/net', 'base/query', 'base/extend']
});

fs.writeFileSync(__dirname + '/bundle.js', bundle);

/*var comm = new ScriptPack({
  basedir: __dirname
});

comm.add(['comm/fetch', 'instance']);
comm.require(['base/net', 'base/query', 'base/extend']);

fs.writeFileSync(__dirname + '/comm.js', comm.bundle());

var bundle = new ScriptPack({
  basedir: __dirname
});

bundle.require(['code']);
bundle.external(['base/net', 'base/query', 'base/extend']);

fs.writeFileSync(__dirname + '/bundle.js', bundle.bundle());*/
