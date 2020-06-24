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

  it('clean cosy', function () {
    let result = convert(
      readFileSync(`${__dirname}/data/mestrec/clean/cosy.jcamp`).toString(),
    );

    expect(result.flatten[0].minMax).toMatchCloseTo(
      {
        minX: -1.0139981026183167,
        maxX: 14.991345966320113,
        minY: -1.013998102618189,
        maxY: 14.991345966320113,
        minZ: 0,
        maxZ: 24654532,
        noise: 0,
      },
      5,
    );
  });

  it('clean hsqc', function () {
    let result = convert(
      readFileSync(`${__dirname}/data/mestrec/clean/hsqc.jcamp`).toString(),
    );
    expect(result.flatten[0].minMax).toMatchCloseTo(
      {
        minX: -0.9947678573314193,
        maxX: 14.994945992789406,
        minY: -8.596750090464695,
        maxY: 171.07589553953267,
        minZ: -653471.28665,
        maxZ: 16896266.794025,
        noise: 1478.441825,
      },
      3,
    );
  });
});
