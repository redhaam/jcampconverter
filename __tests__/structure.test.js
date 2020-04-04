import { readFileSync } from 'fs';
import { join } from 'path';

import { convert } from '../src';

describe('Test various jcamp structures', () => {
  it('simple spectrum', () => {
    let result = convert(
      readFileSync(join(__dirname, '/data/structure/normal.jdx'), 'utf8'),
    );
    expect(result.spectra).toHaveLength(1);
    expect(result.spectra[0].title).toBe('1 2 3');
    expect(result.spectra[0].dataType).toBe('type 1');
    expect(result.spectra[0].data).toStrictEqual({ x: [1, 2], y: [2, 3] });
  });

  it('two spectra', () => {
    let result = convert(
      readFileSync(join(__dirname, '/data/structure/two.jdx'), 'utf8'),
    );
    expect(result.spectra).toHaveLength(2);
    expect(result.spectra[0].title).toBe('1 2 3');
    expect(result.spectra[0].dataType).toBe('type 1');
    expect(result.spectra[0].data).toStrictEqual({ x: [1, 2], y: [2, 3] });
    expect(result.spectra[1].title).toBe('3 4 5');
    expect(result.spectra[1].dataType).toBe('type 2');
    expect(result.spectra[1].data).toStrictEqual({ x: [3, 4], y: [4, 5] });
  });

  it('reim', () => {
    let result = convert(
      readFileSync(join(__dirname, '/data/structure/reim.jdx'), 'utf8'),
    );
    expect(result.spectra).toHaveLength(2);
    expect(result.spectra[0].data).toStrictEqual({
      x: [1, 2, 3],
      y: [2, 3, 4],
    });
    expect(result.spectra[1].data).toStrictEqual({
      x: [1, 2, 3],
      y: [3, 4, 5],
    });
  });

  it.skip('ntuples', () => {
    let result = convert(
      readFileSync(join(__dirname, '/data/structure/ntuples.jdx'), 'utf8'),
      { noContour: true, keepSpectra: true },
    );
    expect(result.spectra).toHaveLength(2);
    expect(result.spectra[0].data).toStrictEqual({
      x: [1, 2, 3],
      y: [2, 3, 4],
    });
    expect(result.spectra[1].data).toStrictEqual({
      x: [1, 2, 3],
      y: [3, 4, 5],
    });
  });

  it('tree', () => {
    let result = convert(
      readFileSync(join(__dirname, '/data/structure/tree.jdx'), 'utf8'),
    );
    // console.log(result);
  });
});
