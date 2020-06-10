import { convert } from '../src';

describe('Test same label', () => {
  it('array if many times same label', () => {
    const jcamp = `##TITLE=
##FIRSTX= 10
##DELTAX= 1
##XYDATA= (X++(Y..Y))
10 AX
##END=`;
    let result = convert(jcamp);
    expect(result.entries[0].spectra[0].data).toStrictEqual({
      x: [10, 11, 12, 13, 14, 15],
      y: [1, 1, 1, 1, 1, 1],
    });
  });

  it('array if many times same label with negative values', () => {
    const jcamp = `##TITLE=
##FIRSTX= 10
##DELTAX= 1
##XYDATA= (X++(Y..Y))
10 aX
##END=`;
    let result = convert(jcamp);
    expect(result.entries[0].spectra[0].data.x).toStrictEqual([
      10,
      11,
      12,
      13,
      14,
      15,
    ]);
    expect(result.entries[0].spectra[0].data.y).toStrictEqual([
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
    ]);
  });
});
