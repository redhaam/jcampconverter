import { readFileSync } from 'fs';
import { join } from 'path';

import { convert } from '../src';

test('Multivariate', () => {
  const result = convert(
    readFileSync(join(__dirname, '/data/misc/multivariable.jdx'), 'utf8'),
  );
  expect(result.logs).toHaveLength(0);
  expect(result.flatten).toHaveLength(1);
  const firstSpectrum = result.flatten[0].spectra[0];

  expect(firstSpectrum.variables).toStrictEqual({
    x: {
      varname: 'Weight',
      symbol: 'X',
      vartype: 'INDEPENDENT',
      vardim: 5,
      units: 'mg',
    },
    y: {
      varname: 'Temperature',
      symbol: 'Y',
      vartype: 'DEPENDENT',
      vardim: 5,
      units: '°C',
    },
    t: {
      varname: 'Time',
      symbol: 'T',
      vartype: 'DEPENDENT',
      vardim: 5,
      units: 's',
    },
  });

  expect(firstSpectrum.data).toStrictEqual({
    x: [100, 90, 80, 70, 60, 50],
    y: [20, 30, 40, 50, 60, 70],
    t: [1, 2, 3, 4, 5, 6],
  });
});
