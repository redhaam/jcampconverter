import { readFileSync } from 'fs';

import { convert } from '../src';

let jcamp = readFileSync(
  `${__dirname}/data/misc/cosy-reference.jdx`,
).toString();

describe('Check cosy reference in both direction', () => {
  it('cosy', () => {
    let result = convert(jcamp, { noContour: true }).flatten[0].minMax;
    expect(result.minX).toBeCloseTo(1.31460646679003);
    expect(result.maxX).toBeCloseTo(9.289331);
    expect(result.minY).toBeCloseTo(1.3184534804663033);
    expect(result.maxY).toBeCloseTo(9.28928220296199);
  });
});
