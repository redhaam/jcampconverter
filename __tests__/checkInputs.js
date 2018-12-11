'use strict';

const Converter = require('..');

describe('Test JCAMP converter for wrong inputs', () => {
  it('throws error', () => {
    const target = 1;
    const result = () => Converter.convert(target);
    expect(result).toThrow(TypeError);
  });
});
