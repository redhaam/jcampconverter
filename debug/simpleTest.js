var Converter = require('..');
var fs = require('fs');

var filename = '/__tests__/data/misc/gcms.jdx';

var result = convert(readFileSync(__dirname + '/..' + filename).toString());

// console.log(result);
