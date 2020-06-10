import { readFileSync } from 'fs';

import { convert } from '../src';

describe('Test JCAMP converter of NMR with peak assignments', () => {
  const target = readFileSync(
    `${__dirname}/data/misc/nmr_13c_dept.dx`,
  ).toString();

  const result = convert(target);

  const peakEntry = result.entries[0].children[2];
  const peakAssignment = peakEntry.spectra[0];

  const nmrTarget = result.entries[0].children[1].spectra[0];

  it('has correct PEAK ASSIGNMENTS parameters', () => {
    expect(peakAssignment.nbPoints).toBe(2);
    expect(peakEntry.dataType).toBe('PEAK ASSIGNMENTS');
    expect(peakAssignment.isXYAdata).toBe(true);
  });

  it('has MAXX, MAXY, MINX and MINY parameters', () => {
    // http://www.jcamp-dx.org/protocols/dxnmr01.pdf (5.3.4)
    expect(peakAssignment.maxX).toBe(235.4936);
    expect(peakAssignment.minX).toBe(-15.458417214338084);
    expect(peakAssignment.maxY).toBe(266635237.0);
    expect(peakAssignment.minY).toBe(-283555411.0);
  });

  it('has data from (XYA)', () => {
    // http://www.jcamp-dx.org/protocols/dxnmr01.pdf (Example 3)
    expect(peakAssignment.data.x[0]).toBeCloseTo(118.93612601748676, 5);
    expect(peakAssignment.data.y[0]).toBeCloseTo(246226528.0, 0);
    expect(peakAssignment.data.x[1]).toBeCloseTo(119.12759305537116, 5);
    expect(peakAssignment.data.y[1]).toBeCloseTo(266635237.0, 0);
    expect(peakAssignment.data.x).toHaveLength(2);
  });

  it('has a sampleDescription', () => {
    expect(peakAssignment.sampleDescription).toBe('This is a test.');
  });

  it('has a shiftOffsetVal parameter for "NMR SPECTRUM"', () => {
    expect(nmrTarget.shiftOffsetVal).toBe(235.4936);
  });
});
