'use strict';

const fs = require('fs');

const Converter = require('../src');

describe('camelLabelsl', () => {
  it('canonized data labels', () => {
    let result = Converter.convert(
      fs.readFileSync(`${__dirname}/data/misc/camelLabels.jdx`, 'utf8'),
      { keepRecordsRegExp: /.*/ },
    );
    expect(result.info.$TEST).toStrictEqual('abc');
  });

  it('non-canonized data labels', () => {
    let result = Converter.convert(
      fs.readFileSync(`${__dirname}/data/misc/camelLabels.jdx`, 'utf8'),
      { keepRecordsRegExp: /.*/, canonicDataLabels: false },
    );
    expect(result.info.$test).toStrictEqual('abc');
  });
});
