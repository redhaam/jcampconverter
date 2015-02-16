'use strict';

var fs = require('fs');
var join = require('path').join;
var convert = require('../').convert;

var datafolder = join(__dirname, '../test/data');

module.exports = function (filename) {
    var jcamp = fs.readFileSync(join(datafolder, filename), 'utf-8');
    return function () {
        convert(jcamp);
    }
};
