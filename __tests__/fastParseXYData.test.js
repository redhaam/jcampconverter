import { readFileSync } from 'fs';

import { convert } from '../src';

const options = {
  fastParse: true,
};
let result = convert(
  readFileSync(`${__dirname}/data/compression/jcamp-fix.dx`).toString(),
  options,
);
let result2 = convert(
  readFileSync(`${__dirname}/data/compression/jcamp-packed.dx`).toString(),
  options,
);
let result3 = convert(
  readFileSync(`${__dirname}/data/compression/jcamp-packed.dx`).toString(),
  options,
);
let result4 = convert(
  readFileSync(`${__dirname}/data/compression/jcamp-difdup.dx`).toString(),
  options,
);
let result5 = convert(
  readFileSync(`${__dirname}/data/compression/jcamp-difdup.dx`).toString(),
);

describe('Test fastParseXYData', () => {
  it('should yield exactly the same data', () => {
    expect(result.entries[0].spectra).toStrictEqual(result2.entries[0].spectra);
    expect(result.entries[0].spectra).toStrictEqual(result3.entries[0].spectra);
    expect(result.entries[0].spectra).toStrictEqual(result4.entries[0].spectra);
    expect(result.entries[0].spectra).toStrictEqual(result5.entries[0].spectra);
  });
});
