import { readFileSync } from 'fs';

import { convert } from '../src';

describe('nucleus', () => {
  it('HSQC with missing nucleus information', () => {
    const jcamp = readFileSync(
      `${__dirname}/data/misc/hmqc-no-nucleus.dx`,
    ).toString();

    const result = convert(jcamp).flatten[0];

    expect(result.ntuples[0].nucleus).toBe('13C');
    expect(result.ntuples[1].nucleus).toBe('1H');
    expect(result.xType).toBe('1H');
    expect(result.yType).toBe('13C');
  });
  it('NOESY with missing nucleus information', () => {
    const jcamp = readFileSync(`${__dirname}/data/misc/noesy.dx`).toString();

    const result = convert(jcamp).flatten[0];

    expect(result.ntuples[0].nucleus).toBe('1H');
    expect(result.ntuples[1].nucleus).toBe('1H');
    expect(result.xType).toBe('1H');
    expect(result.yType).toBe('1H');
  });
});
