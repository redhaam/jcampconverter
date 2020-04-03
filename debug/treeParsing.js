const { readFileSync } = require('fs');
const { join } = require('path');
const convert = require('../src').convert;

var datafolder = join(__dirname, '../__tests__/data');

var data = readFileSync(join(datafolder, 'tree-hsqc-1h13c.dx'), 'utf8');

let result = convert(data, { noContour: true });

console.log(result);
