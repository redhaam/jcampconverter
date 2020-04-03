const { readFileSync } = require('fs');
const { join } = require('path');
const convert = require('../src').convert;

var datafolder = join(__dirname, '../__tests__/data');

var data = readFileSync(join(datafolder, 'tree-uv.jdx'), 'utf8');

let result = convert(data);

console.log(result);
