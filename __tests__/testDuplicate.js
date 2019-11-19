'use strict';

const Converter = require('../src');

describe('Test same label', () => {
  it('array if many times same label', () => {
    const jcamp = `##TITLE=
##FIRSTX= 10
##DELTAX= 1
##XYDATA= (X++(Y..Y))
10 AX
##END=`;
    let result = Converter.convert(jcamp);
    expect(result.spectra[0].data).toStrictEqual([
      [10, 1, 11, 1, 12, 1, 13, 1, 14, 1, 15, 1],
    ]);
  });

  it('array if many times same label with negative values', () => {
    const jcamp = `##TITLE=
##FIRSTX= 10
##DELTAX= 1
##XYDATA= (X++(Y..Y))
10 aX
##END=`;
    let result = Converter.convert(jcamp);
    expect(result.spectra[0].data).toStrictEqual([
      [10, -1, 11, -1, 12, -1, 13, -1, 14, -1, 15, -1],
    ]);
  });
});
