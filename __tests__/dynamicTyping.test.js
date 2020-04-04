import { readFileSync } from 'fs';

import { convert } from '../src';

describe('camelLabelsl', () => {
  it('canonized data labels', () => {
    let result = convert(
      readFileSync(`${__dirname}/data/misc/dynamicTyping.jdx`, 'utf8'),
      { keepRecordsRegExp: /.*/, dynamicTyping: true },
    );
    expect(result.entries[0].info.$STRING).toStrictEqual('abc');
    expect(result.entries[0].info.$NUMBER).toStrictEqual(123);
  });
});
