'use strict';

const fs = require('fs');

const Converter = require('..');

const gcms = fs.readFileSync(`${__dirname}/data/misc/gcms.jdx`).toString();
const chromTest = fs
  .readFileSync(`${__dirname}/data/misc/chrom.jdx`)
  .toString();

describe('Test JCAMP converter of GCMS', () => {
  it('complex chromatogram', () => {
    let result = Converter.convert(gcms, { chromatogram: true });
    let chrom = result.chromatogram;

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
    let result = Converter.convert(chromTest, { chromatogram: true });
    let chrom = result.chromatogram;

    // Check content
    expect(chrom.times).toBeInstanceOf(Array);
    expect(chrom.series).toBeInstanceOf(Object);

    // Check length
    expect(chrom.times).toHaveLength(10530);
    expect(chrom.series.intensity.data).toHaveLength(10530);
  });
});
