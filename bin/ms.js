#!/usr/bin/env node

/**
 * Made Script
 * @author: SimonHao
 * @date:   2016-01-25 10:35:17
 */

'use strict';

var program = require('commander');
var info    = require('../package');
var compile = require('../index');
var path    = require('path');
var fs      = require('fs');

program
  .version(info.version)
  .usage('<source file> <dist file>')
  .parse(process.argv);


var source_file, dist_file;

if(path.isAbsolute(program.args[0])){
  source_file = program.args[0];
}else{
  source_file = path.join(process.cwd(), program.args[0]);
}

if(path.isAbsolute(program.args[1])){
  dist_file = program.args[1];
}else{
  dist_file   = path.join(process.cwd(), program.args[1]);
}

if(fs.existsSync(source_file)){
  fs.writeFileSync(dist_file, compile.compile_file(source_file));
}else{
  console.error("source file dont exists", source_file);
}