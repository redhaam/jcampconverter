'use strict';

const fs = require('fs');

const Converter = require('..');

let jcamp = fs.readFileSync(`${__dirname}/data/misc/iv.jdx`).toString();

describe('Test conversion option for jcamp', () => {
  it('1H NMR ethyl vinyl ether', () => {
    let result = Converter.convert(jcamp, { xy: true });

    let x = result.spectra[0].data[0].x;
    let y = result.spectra[0].data[0].y;

    // Check X and Y length
    expect(x).toHaveLength(302);
    expect(y).toHaveLength(302);

    // Check type is peak table
    let type = result.spectra[0];
    expect(type).not.toHaveProperty('isXYdata');
    expect(type.isPeaktable).toBe(true);
  });

  it('withoutXY', () => {
    let result = Converter.convert(jcamp, {
      withoutXY: true,
      keepRecordsRegExp: /.*/,
    });
    expect(result.info.TITLE).toBe('abc');
    expect(result.info).not.toHaveProperty('PEAKTABLE');
  });
});
