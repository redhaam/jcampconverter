import { readFileSync } from 'fs';

import { convert } from '../src';

describe('Test same label', () => {
  it('array if many times same label', () => {
    let result = convert(
      readFileSync(`${__dirname}/data/misc/sameLabel.jdx`, 'utf8'),
      { keepRecordsRegExp: /.*/ },
    );
    expect(result.entries[0].info.$TEST).toStrictEqual(['abc', 'bcd', 'def']);
  });
});
