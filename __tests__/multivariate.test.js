import { readFileSync } from 'fs';
import { join } from 'path';

import { convert } from '../src';

test('Multivariate', () => {
  let result = convert(
    readFileSync(join(__dirname, '/data/misc/multivariable.jdx'), 'utf8'),
  );
  console.log(result.logs);
  console.log(result.flatten[0].spectra);
  expect(result.entries[0].ntuples).toHaveLength(3);
  expect(result.entries[0].twoD).toBe(true);
  expect(result.entries[0].contourLines).toBeInstanceOf(Object);
});
