'use strict';

const fs = require('fs');

const Converter = require('../src');

describe('Test same label', () => {
  it('array if many times same label', () => {
    let result = Converter.convert(
      fs.readFileSync(`${__dirname}/data/misc/sameLabel.jdx`, 'utf8'),
      { keepRecordsRegExp: /.*/ },
    );
    expect(result.info.$TEST).toStrictEqual(['abc', 'bcd', 'def']);
  });
});
