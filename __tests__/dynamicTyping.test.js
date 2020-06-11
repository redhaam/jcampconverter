import { readFileSync } from 'fs';

import { convert } from '../src';

describe('camelLabelsl', () => {
  it('canonized data labels default option', () => {
    let result = convert(
      readFileSync(`${__dirname}/data/misc/dynamicTyping.jdx`, 'utf8'),
      { keepRecordsRegExp: /.*/ },
    );
    expect(result.entries[0].meta.STRING).toStrictEqual('abc');
    expect(result.entries[0].meta.NUMBER).toStrictEqual(123);
  });

  it('canonized data labels true', () => {
    let result = convert(
      readFileSync(`${__dirname}/data/misc/dynamicTyping.jdx`, 'utf8'),
      { keepRecordsRegExp: /.*/, dynamicTyping: true },
    );
    expect(result.entries[0].meta.STRING).toStrictEqual('abc');
    expect(result.entries[0].meta.NUMBER).toStrictEqual(123);
  });

  it('canonized data labels false', () => {
    let result = convert(
      readFileSync(`${__dirname}/data/misc/dynamicTyping.jdx`, 'utf8'),
      { keepRecordsRegExp: /.*/, dynamicTyping: false },
    );
    expect(result.entries[0].meta.STRING).toStrictEqual('abc');
    expect(result.entries[0].meta.NUMBER).toStrictEqual('123');
  });
});
