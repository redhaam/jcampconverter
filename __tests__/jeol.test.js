import { readFileSync } from 'fs';

import { convert } from '../src';

test('JEOL', () => {
  let result = convert(readFileSync(`${__dirname}/data/jeol.dx`, 'utf8'));
  let spectrum = result.flatten[0].spectra[0];

  expect(spectrum.firstX).toBeCloseTo(15.1029, 3);
  expect(spectrum.lastX).toBeCloseTo(-4.88666, 4);
});
