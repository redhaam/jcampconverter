import { readFileSync } from 'fs';

import { convert } from '../src';

describe('camelLabels', () => {
  it('canonized data labels', () => {
    let result = convert(
      readFileSync(`${__dirname}/data/misc/camelLabels.jdx`, 'utf8'),
      { keepRecordsRegExp: /.*/ },
    );
    expect(result.entries[0].info.FIRSTX).toStrictEqual(0.905);
    expect(result.entries[0].meta.test).toStrictEqual('abc');
  });

  it('non-canonized data labels', () => {
    let result = convert(
      readFileSync(`${__dirname}/data/misc/camelLabels.jdx`, 'utf8'),
      { keepRecordsRegExp: /.*/, canonicDataLabels: false },
    );
    expect(result.entries[0].info['first X']).toStrictEqual(0.905);
    expect(result.entries[0].meta.test).toStrictEqual('abc');
  });

  it('canonized metadata labels', () => {
    let result = convert(
      readFileSync(`${__dirname}/data/misc/camelLabels.jdx`, 'utf8'),
      { keepRecordsRegExp: /.*/ },
    );
    expect(result.entries[0].info.FIRSTX).toStrictEqual(0.905);
    expect(result.entries[0].meta.test).toStrictEqual('abc');
  });

  it('non-canonized metadata labels', () => {
    let result = convert(
      readFileSync(`${__dirname}/data/misc/camelLabels.jdx`, 'utf8'),
      { keepRecordsRegExp: /.*/, canonicMetadataLabels: true },
    );
    expect(result.entries[0].info.FIRSTX).toStrictEqual(0.905);
    expect(result.entries[0].meta.TEST).toStrictEqual('abc');
  });
});
