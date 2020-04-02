'use strict';

const fs = require('fs');

const Converter = require('..');

describe('Test from ACD Jcamp generator', () => {
  it('COSY simulated spectrum', () => {
    let result = Converter.convert(
      fs.readFileSync(`${__dirname}/data/acd/test1_cosy.jdx`).toString(),
      { xy: true },
    );
    expect(result.ntuples).toHaveLength(3);
    expect(result.twoD).toBe(true);
    expect(result.contourLines).toBeInstanceOf(Object);
  });
});
