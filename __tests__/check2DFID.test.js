import { readFileSync } from 'fs';

import { convert } from '../src';

let jcamp = readFileSync(`${__dirname}/data/cytisine/HMBC-fid.dx`).toString();

describe('Test conversion of 2D fid', () => {
  it('cytisine', () => {
    let result = convert(jcamp, { keepSpectra: true });
    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].spectra).toHaveLength(1024);
  });
});
