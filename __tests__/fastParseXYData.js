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
    expect(result.spectra).toStrictEqual(result2.spectra);
    expect(result.spectra).toStrictEqual(result3.spectra);
    expect(result.spectra).toStrictEqual(result4.spectra);
    expect(result.spectra).toStrictEqual(result5.spectra);
  });
});
