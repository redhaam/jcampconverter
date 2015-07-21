'use strict';

var Converter = require('..');
var fs = require('fs');

var filename='/test/data/misc/gcms.jdx';

var result = Converter.convert(fs.readFileSync(__dirname + '/..' + filename).toString());

// console.log(result);