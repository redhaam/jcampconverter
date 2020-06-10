import { readFileSync } from 'fs';

import { convert } from '../src';

describe('Test from ACD Jcamp generator', () => {
  it('COSY simulated spectrum', () => {
    let result = convert(
      readFileSync(`${__dirname}/data/acd/test1_cosy.jdx`).toString(),
    );
    expect(result.entries[0].ntuples).toHaveLength(3);
    expect(result.entries[0].twoD).toBe(true);
    expect(result.entries[0].contourLines).toBeInstanceOf(Object);
  });
});
