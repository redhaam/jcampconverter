'use strict';

const fs = require('fs');

const Converter = require('..');

const options = {
  fastParse: true,
};
let result = Converter.convert(
  fs.readFileSync(`${__dirname}/data/compression/jcamp-fix.dx`).toString(),
  options,
);
let result2 = Converter.convert(
  fs.readFileSync(`${__dirname}/data/compression/jcamp-packed.dx`).toString(),
  options,
);
let result3 = Converter.convert(
  fs.readFileSync(`${__dirname}/data/compression/jcamp-packed.dx`).toString(),
  options,
);
let result4 = Converter.convert(
  fs.readFileSync(`${__dirname}/data/compression/jcamp-difdup.dx`).toString(),
  options,
);
let result5 = Converter.convert(
  fs.readFileSync(`${__dirname}/data/compression/jcamp-difdup.dx`).toString(),
);

describe('Test fastParseXYData', () => {
  it('should yield exactly the same data', () => {
    expect(result.spectra).toStrictEqual(result2.spectra);
    expect(result.spectra).toStrictEqual(result3.spectra);
    expect(result.spectra).toStrictEqual(result4.spectra);
    expect(result.spectra).toStrictEqual(result5.spectra);
  });
});
