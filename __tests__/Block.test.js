import { readFileSync } from 'fs';

import { convert } from '../src';

describe('Test from ACD Jcamp generator', () => {
  it('COSY simulated spectrum', () => {
    let result = convert(
      readFileSync(`${__dirname}/data/acd/test1_cosy.jdx`).toString(),
      { xy: true },
    );
    expect(result.ntuples).toHaveLength(3);
    expect(result.twoD).toBe(true);
    expect(result.contourLines).toBeInstanceOf(Object);
  });
});
