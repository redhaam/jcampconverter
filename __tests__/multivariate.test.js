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
    X: {
      name: 'Weight',
      symbol: 'X',
      type: 'INDEPENDENT',
      dim: 5,
      units: 'mg',
      data: [100, 90, 80, 70, 60, 50],
    },
    Y: {
      name: 'Temperature',
      symbol: 'Y',
      type: 'DEPENDENT',
      dim: 5,
      units: '°C',
      data: [20, 30, 40, 50, 60, 70],
    },
    T: {
      name: 'Time',
      symbol: 'T',
      type: 'DEPENDENT',
      dim: 5,
      units: 's',
      data: [1, 2, 3, 4, 5, 6],
    },
  });

  expect(firstSpectrum.xUnits).toBe('Weight [mg]');
  expect(firstSpectrum.yUnits).toBe('Temperature [°C]');

  expect(firstSpectrum.data).toStrictEqual({
    X: [100, 90, 80, 70, 60, 50],
    Y: [20, 30, 40, 50, 60, 70],
    T: [1, 2, 3, 4, 5, 6],
  });
});
