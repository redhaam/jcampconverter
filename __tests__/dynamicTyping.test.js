'use strict';

const fs = require('fs');

const Converter = require('../src');

describe('camelLabelsl', () => {
  it('canonized data labels', () => {
    let result = Converter.convert(
      fs.readFileSync(`${__dirname}/data/misc/dynamicTyping.jdx`, 'utf8'),
      { keepRecordsRegExp: /.*/, dynamicTyping: true },
    );
    expect(result.info.$STRING).toStrictEqual('abc');
    expect(result.info.$NUMBER).toStrictEqual(123);
  });
});
