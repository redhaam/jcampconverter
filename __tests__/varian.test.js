import { readFileSync } from 'fs';

import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { convert } from '../src';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('Varian Jcamp', function () {
  it('NMR 1H spectrum 16384', function () {
    let result = convert(
      readFileSync(`${__dirname}/data/misc/varian.jdx`, 'utf8'),
    );
    let data = result.entries[0].spectra[0].data;
    expect(data.x).toHaveLength(16384);
    expect(data.y).toHaveLength(16384);
  });
});
