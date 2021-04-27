import { readFileSync } from 'fs';

import { convert } from '../src';

describe('Check for special org.cheminfo.meta LDR', () => {
  it('array if many times same label', () => {
    let result = convert(
      readFileSync(`${__dirname}/data/misc/cheminfo-meta.jdx`, 'utf8'),
      { keepRecordsRegExp: /.*/ },
    );
    expect(result.flatten[0].meta.cheminfo).toStrictEqual('def');
  });
});
