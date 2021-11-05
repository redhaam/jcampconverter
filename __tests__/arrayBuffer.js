import { readFileSync } from 'fs';

import { convert } from '../src';

test('from ArrayBuffer', () => {
  const arrayBuffer = toArrayBuffer(readFileSync(`${__dirname}/data/jeol.dx`));
  let result = convert(arrayBuffer);
  let spectrum = result.flatten[0].spectra[0];
  expect(arrayBuffer).toBeInstanceOf(ArrayBuffer);
  expect(spectrum.firstX).toBeCloseTo(15.1029, 3);
  expect(spectrum.lastX).toBeCloseTo(-4.88666, 4);
  expect(spectrum.deltaX).toBeCloseTo(-0.0012201, 4);
});

test('from Uint8Array', () => {
  const blob = new Uint8Array(readFileSync(`${__dirname}/data/jeol.dx`));
  let result = convert(blob);
  let spectrum = result.flatten[0].spectra[0];
  expect(spectrum.firstX).toBeCloseTo(15.1029, 3);
  expect(spectrum.lastX).toBeCloseTo(-4.88666, 4);
  expect(spectrum.deltaX).toBeCloseTo(-0.0012201, 4);
});

function toArrayBuffer(buf) {
  let ab = new ArrayBuffer(buf.length);
  let view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}
