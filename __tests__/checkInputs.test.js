import { convert } from '../src';

describe('Test JCAMP converter for wrong inputs', () => {
  it('throws error', () => {
    const target = 1;
    const result = () => convert(target);
    expect(result).toThrow(TypeError);
  });
});
