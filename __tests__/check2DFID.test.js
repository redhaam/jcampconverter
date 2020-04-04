import { readFileSync } from 'fs';

import { convert } from '../src';

let jcamp = readFileSync(`${__dirname}/data/cytisine/HMBC-fid.dx`).toString();

describe('Test conversion of 2D fid', () => {
  it('cytisine', () => {
    let result = convert(jcamp, { keepSpectra: true });
    //console.log(result);
  });
});
