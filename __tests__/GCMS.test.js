import { readFileSync } from 'fs';

import { convert } from '../src';

describe('Test JCAMP converter of GCMS', () => {
  it('complex chromatogram', () => {
    const gcms = readFileSync(`${__dirname}/data/misc/gcms.jdx`).toString();
    let result = convert(gcms, { chromatogram: true });
    let chrom = result.entries[0].chromatogram;

    // Check content
    expect(chrom.times).toBeInstanceOf(Array);
    expect(chrom.series).toBeInstanceOf(Object);
    // Check length
    expect(chrom.times).toHaveLength(2420);
    expect(chrom.series.ms.data).toHaveLength(2420);
    expect(chrom.series.tic.data).toHaveLength(2420);
    expect(chrom.series.scannumber.data).toHaveLength(2420);
  });

  it('simple chromatogram', () => {
    const chromTest = readFileSync(
      `${__dirname}/data/misc/chrom.jdx`,
    ).toString();
    let result = convert(chromTest, { chromatogram: true });
    let chrom = result.entries[0].chromatogram;

    // Check content
    expect(chrom.times).toBeInstanceOf(Array);
    expect(chrom.series).toBeInstanceOf(Object);

    // Check length
    expect(chrom.times).toHaveLength(10530);
    expect(chrom.series.intensity.data).toHaveLength(10530);
  });
});
