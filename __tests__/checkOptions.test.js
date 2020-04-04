import { readFileSync } from 'fs';

import { convert } from '../src';

describe('Test JCAMP options', () => {
  it('1H NMR ethyl vinyl ether', () => {
    let result = convert(
      readFileSync(`${__dirname}/data/ethylvinylether/1h.jdx`).toString(),
      { keepRecordsRegExp: /^.+$/ },
    );

    expect(Object.keys(result.entries[0].info)).toHaveLength(384);
    expect(result.entries[0].info.$SOLVENT).toBe('<DMSO>');
  });
});

const checkOptions = (filename, options, goal, label) => {
  const target = readFileSync(`${__dirname}/data${filename}`).toString();

  describe(`Test ${label}`, () => {
    it('disables profiling by default', () => {
      const result = convert(target);
      expect(result.profiling).toBe(false);
    });

    it('enables profiling to return Goal', () => {
      const result = convert(target, options);
      const actions = result.profiling.map((p) => p.action);
      const isGoalInActs = actions.indexOf(goal) >= 0;
      expect(isGoalInActs).toBe(true);
    });
  });
};

describe('Test JCAMP converter Options for NMR 13C_DEPT', () => {
  const target = readFileSync(
    `${__dirname}/data/misc/nmr_13c_dept.dx`,
  ).toString();

  const options = {
    profiling: true,
  };

  it('disables profiling by default', () => {
    const result = convert(target);
    expect(result.profiling).toBe(false);
  });

  it('enables profiling to return array', () => {
    const result = convert(target, options);
    expect(result.profiling).toBeInstanceOf(Array);
  });
});

describe('Test JCAMP converter Options', () => {
  checkOptions(
    '/misc/chrom.jdx',
    {
      profiling: true,
      chromatogram: true,
    },
    'Finished chromatogram calculation',
    'chrom',
  );

  checkOptions(
    '/acd/test1_cosy.jdx',
    {
      profiling: true,
      xy: true,
    },
    'Finished countour plot calculation',
    '2D',
  );
});
