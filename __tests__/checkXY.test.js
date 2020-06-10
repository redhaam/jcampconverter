import { readFileSync } from 'fs';

import { convert } from '../src';

let jcamp = readFileSync(`${__dirname}/data/misc/iv.jdx`).toString();

describe('Test conversion option for jcamp', () => {
  it('1H NMR ethyl vinyl ether', () => {
    let result = convert(jcamp);

    let x = result.entries[0].spectra[0].data.x;
    let y = result.entries[0].spectra[0].data.y;

    // Check X and Y length
    expect(x).toHaveLength(302);
    expect(y).toHaveLength(302);

    // Check type is peak table
    let type = result.entries[0].spectra[0];
    expect(type).not.toHaveProperty('isXYdata');
    expect(type.isPeaktable).toBe(true);
  });

  it('withoutXY', () => {
    let result = convert(jcamp, {
      withoutXY: true,
      keepRecordsRegExp: /.*/,
    });
    expect(result.entries[0].info.TITLE).toBe('abc');
    expect(result.entries[0].info).not.toHaveProperty('PEAKTABLE');
  });
});
