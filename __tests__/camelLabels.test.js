import { readFileSync } from 'fs';

import { convert } from '../src';

describe('camelLabels', () => {
  it('canonized data labels', () => {
    let result = convert(
      readFileSync(`${__dirname}/data/misc/camelLabels.jdx`, 'utf8'),
      { keepRecordsRegExp: /.*/ },
    );
    expect(result.info.$TEST).toStrictEqual('abc');
  });

  it('non-canonized data labels', () => {
    let result = convert(
      readFileSync(`${__dirname}/data/misc/camelLabels.jdx`, 'utf8'),
      { keepRecordsRegExp: /.*/, canonicDataLabels: false },
    );
    expect(result.info.$test).toStrictEqual('abc');
  });
});
