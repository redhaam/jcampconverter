'use strict';

const Converter = require('..');

const fs = require('fs');

const options = {
  fastParse: true
};
var result = Converter.convert(
  fs.readFileSync(`${__dirname}/data/compression/jcamp-fix.dx`).toString(),
  options
);
var result2 = Converter.convert(
  fs.readFileSync(`${__dirname}/data/compression/jcamp-packed.dx`).toString(),
  options
);
var result3 = Converter.convert(
  fs.readFileSync(`${__dirname}/data/compression/jcamp-packed.dx`).toString(),
  options
);
var result4 = Converter.convert(
  fs.readFileSync(`${__dirname}/data/compression/jcamp-difdup.dx`).toString(),
  options
);
var result5 = Converter.convert(
  fs.readFileSync(`${__dirname}/data/compression/jcamp-difdup.dx`).toString()
);

describe('Test fastParseXYData', () => {
  it('It should yield exactly the same data', () => {
    expect(result.spectra).toStrictEqual(result2.spectra);
    expect(result.spectra).toStrictEqual(result3.spectra);
    expect(result.spectra).toStrictEqual(result4.spectra);
    expect(result.spectra).toStrictEqual(result5.spectra);
  });
});
