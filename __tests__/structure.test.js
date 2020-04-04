import { readFileSync } from 'fs';
import { join } from 'path';

import { convert } from '../src';

describe('Test various jcamp structures', () => {
  it('simple spectrum', () => {
    let result = convert(
      readFileSync(join(__dirname, '/data/structure/normal.jdx'), 'utf8'),
    );
    expect(result.entries[0].spectra).toHaveLength(1);
    expect(result.entries[0].title).toBe('1 2 3');
    expect(result.entries[0].dataType).toBe('type 1');
    expect(result.entries[0].spectra[0].data).toStrictEqual({
      x: [1, 2],
      y: [2, 3],
    });
  });

  it('no end', () => {
    let result = convert(
      readFileSync(join(__dirname, '/data/structure/noend.jdx'), 'utf8'),
    );
    expect(result.entries[0].spectra).toHaveLength(1);
    expect(result.entries[0].title).toBe('1 2 3');
    expect(result.entries[0].dataType).toBe('type 1');
    expect(result.entries[0].spectra[0].data).toStrictEqual({
      x: [1, 2],
      y: [2, 3],
    });
    expect(result.flatten).toHaveLength(1);
  });

  it('two spectra', () => {
    let result = convert(
      readFileSync(join(__dirname, '/data/structure/two.jdx'), 'utf8'),
    );
    expect(result.entries).toHaveLength(2);
    expect(result.entries[0].spectra).toHaveLength(1);
    expect(result.entries[0].title).toBe('1 2 3');
    expect(result.entries[0].dataType).toBe('type 1');
    expect(result.entries[0].spectra[0].data).toStrictEqual({
      x: [1, 2],
      y: [2, 3],
    });
    expect(result.entries[1].title).toBe('3 4 5');
    expect(result.entries[1].dataType).toBe('type 2');
    expect(result.entries[1].spectra[0].data).toStrictEqual({
      x: [3, 4],
      y: [4, 5],
    });
  });

  it('reim', () => {
    let result = convert(
      readFileSync(join(__dirname, '/data/structure/reim.jdx'), 'utf8'),
    );
    expect(result.entries[0].spectra).toHaveLength(2);
    expect(result.entries[0].spectra[0].data).toStrictEqual({
      x: [1, 2, 3],
      y: [2, 3, 4],
    });
    expect(result.entries[0].spectra[1].data).toStrictEqual({
      x: [1, 2, 3],
      y: [3, 4, 5],
    });
  });

  it('ntuples', () => {
    let result = convert(
      readFileSync(join(__dirname, '/data/structure/ntuples.jdx'), 'utf8'),
      { noContour: true, keepSpectra: true },
    );
    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].spectra).toHaveLength(4);
    expect(result.entries[0].spectra[0].data).toStrictEqual({
      x: [4, 5, 6],
      y: [2, 3, 4],
    });
    expect(result.entries[0].spectra[1].data).toStrictEqual({
      x: [4, 5, 6],
      y: [3, 4, 5],
    });
  });

  it('tree', () => {
    let result = convert(
      readFileSync(join(__dirname, '/data/structure/tree.jdx'), 'utf8'),
    );
    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].children).toHaveLength(2);

    expect(result.flatten).toHaveLength(3);
  });

  it('empty', () => {
    let result = convert('');
    expect(result.entries).toHaveLength(0);
    expect(result.flatten).toHaveLength(0);
  });

  it('assigned', () => {
    let result = convert(
      readFileSync(join(__dirname, '/data/structure/assigned.jdx'), 'utf8'),
      { keepRecordsRegExp: /.*/ },
    );
    expect(result.entries).toHaveLength(1);
    let children = result.entries[0].children;
    expect(children).toHaveLength(3);
    expect(children[0].children).toHaveLength(2);
    expect(result).toMatchSnapshot();
  });
});
