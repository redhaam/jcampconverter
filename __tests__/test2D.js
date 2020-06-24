import { readFileSync } from 'fs';
import { join } from 'path';

import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { convert } from '../src';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('2D spectra', () => {
  it('cosy bruker', () => {
    let jcamp = readFileSync(
      join(__dirname, '/data/indometacin/cosy.dx'),
      'utf8',
    );
    let result = convert(jcamp);
    expect(result.flatten[0].minMax).toBeDeepCloseTo(
      {
        minX: 1.3052585346871837,
        maxX: 13.42727,
        minY: 1.305159562774377,
        maxY: 13.427171028086525,
        minZ: -452502,
        maxZ: 425754929,
        noise: 2797,
      },
      3,
    );
  });

  it('hsqc bruker', () => {
    let jcamp = readFileSync(
      join(__dirname, '/data/indometacin/hsqc.dx'),
      'utf8',
    );
    let result = convert(jcamp);

    expect(result.flatten[0].minMax).toBeDeepCloseTo(
      {
        minX: 1.3052585346871837,
        maxX: 13.42727,
        minY: -10.004939033328021,
        maxY: 169.9934958572927,
        minZ: -18314706,
        maxZ: 335826203,
        noise: 281769,
      },
      1,
    );
  });
});
