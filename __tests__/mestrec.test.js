import { readFileSync } from 'fs';

import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { convert } from '../src';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('Test from Mestrec Jcamp generator', function () {
  it('NMR 1H spectrum 256', function () {
    let result = convert(
      readFileSync(`${__dirname}/data/mestrec/jcamp-256.jdx`).toString(),
    );
    let data = result.entries[0].spectra[0].data;
    expect(data.x).toHaveLength(256);
    expect(data.y).toHaveLength(256);
  });

  it('NMR 1H spectrum 1024', function () {
    let result = convert(
      readFileSync(`${__dirname}/data/mestrec/jcamp-1024.jdx`).toString(),
    );
    let data = result.entries[0].spectra[0].data;
    expect(data.x).toHaveLength(1024);
    expect(data.y).toHaveLength(1024);
  });

  it('NMR 1H spectrum difdup', function () {
    let result = convert(
      readFileSync(`${__dirname}/data/mestrec/jcamp-difdup.jdx`).toString(),
    );
    let data = result.entries[0].spectra[0].data;
    expect(data.x).toHaveLength(16384);
    expect(data.y).toHaveLength(16384);
    // console.log(data.x.length, Math.max(...data.x), Math.min(...data.x));
    // console.log(data.y.length, Math.max(...data.y), Math.min(...data.y));
  });

  it('cosy', function () {
    let result = convert(
      readFileSync(`${__dirname}/data/mestrec/cosy-clean.jdx`).toString(),
    );

    expect(result.flatten[0].minMax).toMatchCloseTo(
      {
        minX: -1,
        maxX: 15,
        minY: -10203.106874996587,
        maxY: 9008.88230769571,
        minZ: 0,
        maxZ: 64196813.529800005,
        noise: 0,
      },
      1,
    );
  });
});
