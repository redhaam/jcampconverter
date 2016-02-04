'use strict';

const JcampConverter = require('./converter');

function convert(input, options) {
    if (typeof input !== 'string') {
        throw new TypeError('input must be a string');
    }
    const converter = new JcampConverter(input, options || {});
    return converter.convert();
}

exports.convert = convert;
