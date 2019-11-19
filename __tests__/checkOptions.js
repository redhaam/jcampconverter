'use strict';

const fs = require('fs');

const Converter = require('..');

describe('Test JCAMP options', () => {
  it('1H NMR ethyl vinyl ether', () => {
    let result = Converter.convert(
      fs.readFileSync(`${__dirname}/data/ethylvinylether/1h.jdx`).toString(),
      { keepRecordsRegExp: /^.+$/ },
    );

    expect(Object.keys(result.info)).toHaveLength(385);
    expect(result.info.$SOLVENT).toBe('<DMSO>');
  });
});

const checkOptions = (filename, options, goal, label) => {
  const target = fs.readFileSync(`${__dirname}/data${filename}`).toString();

  describe(`Test ${label}`, () => {
    it('disables profiling by default', () => {
      const result = Converter.convert(target);
      expect(result.profiling).toBe(false);
    });

    it('enables profiling to return Goal', () => {
      const result = Converter.convert(target, options);
      const actions = result.profiling.map((p) => p.action);
      const isGoalInActs = actions.indexOf(goal) >= 0;
      expect(isGoalInActs).toBe(true);
    });
  });
};

describe('Test JCAMP converter Options for NMR 13C_DEPT', () => {
  const target = fs
    .readFileSync(`${__dirname}/data/misc/nmr_13c_dept.dx`)
    .toString();

  const options = {
    profiling: true,
  };

  it('disables profiling by default', () => {
    const result = Converter.convert(target);
    expect(result.profiling).toBe(false);
  });

  it('enables profiling to return array', () => {
    const result = Converter.convert(target, options);
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
