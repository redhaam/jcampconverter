import { readFileSync } from 'fs';
import { join } from 'path';

import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { convert } from '../src';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

function checkJcamp(filename, label, data) {
  const result = convert(
    readFileSync(`${__dirname}/data${filename}`).toString(),
  );
  describe(`Test ${label}`, () => {
    it('xAxis type', () => {
      expect(result.entries[0].xType).toStrictEqual(data.xType);
    });

    if (result.entries[0].spectra) {
      it('Number of spectra present', () => {
        expect(result.entries[0].spectra).toHaveLength(data.nbSpectra);
      });

      it('Spectrum data', () => {
        let spectrum = result.entries[0].spectra[0];
        expect(spectrum.observeFrequency).toStrictEqual(data.observeFrequency);
        expect(spectrum.nbPoints).toStrictEqual(data.nbPoints);
        expect(spectrum.nbPoints).toStrictEqual(spectrum.data.x.length);
        expect(spectrum.nbPoints).toStrictEqual(spectrum.data.y.length);
        expect(spectrum.firstX).toBeCloseTo(data.firstX, 5);
        expect(spectrum.lastX).toBeCloseTo(data.lastX, 5);
        expect(
          spectrum.data.x.reduce((a, b) => a + b) +
            spectrum.data.y.reduce((a, b) => a + b),
        ).toBeCloseTo(data.total, 3);
      });
    }
  });
}

test('dynamicTyping', () => {
  const arrayBuffer = readFileSync(
    join(__dirname, 'data/ethylvinylether/1h.jdx'),
  );
  let result = convert(arrayBuffer, {
    dynamicTyping: false,
    keepRecordsRegExp: /.*/,
  }).flatten[0];
  expect(result.meta.O4).toStrictEqual('100020000');
  result = convert(arrayBuffer, {
    dynamicTyping: true,
    keepRecordsRegExp: /.*/,
  }).flatten[0];
  expect(result.meta.O4).toStrictEqual(100020000);
});

describe('Test JCAMP converter', () => {
  checkJcamp('/ethylvinylether/1h.jdx', '1H NMR Ethyl vinyl ether', {
    nbSpectra: 2,
    xType: '1H',
    observeFrequency: 400.112,
    nbPoints: 16384,
    firstX: 11.00659,
    lastX: -1.009276326659311,
    total: 10199322812.993612,
  });

  describe('All those compressions should give exactly the dame result', () => {
    let options = {
      nbSpectra: 1,
      xType: '1H',
      observeFrequency: 400.1321303162,
      nbPoints: 16384,
      firstX: 12.31284,
      lastX: -1.6646457842364946,
      total: 11044828778.007011,
    };

    checkJcamp('/compression/jcamp-fix.dx', 'Compression fixed', options);
    checkJcamp('/compression/jcamp-packed.dx', 'Compression packed', options);
    checkJcamp(
      '/compression/jcamp-squeezed.dx',
      'Compression squeezed',
      options,
    );
    checkJcamp('/compression/jcamp-difdup.dx', 'Compression difdup', options);
  });

  checkJcamp('/indometacin/1h.dx', '1H NMR Indometacin', {
    nbSpectra: 1,
    xType: '1H',
    observeFrequency: 399.682468187609,
    nbPoints: 32768,
    firstX: 16.46138,
    lastX: -4.114164000759506,
    total: 34968303169.78704,
  });

  checkJcamp('/indometacin/cosy.dx', 'COSY Indometacin', {
    nbSpectra: 1024,
    xType: '1H',
    observeFrequency: 399.682944878731,
    nbPoints: 1024,
    firstX: 13.42727,
    lastX: 1.3052585346869103,
    total: 543213.05460976,
  });

  checkJcamp('/indometacin/hsqc.dx', 'HSQC Indometacin', {
    nbSpectra: 1024,
    xType: '1H',
    observeFrequency: 399.682944878731,
    nbPoints: 1024,
    firstX: 13.42727,
    lastX: 1.3052585346869103,
    total: 8546795.054609755,
  });

  checkJcamp('/indometacin/hmbc.dx', 'HMBC Indometacin', {
    nbSpectra: 1024,
    xType: '1H',
    observeFrequency: 399.682956295637,
    nbPoints: 1024,
    firstX: 13.35119,
    lastX: 1.4369847858490203,
    total: 24130609.545490365,
  });

  // TODO fix this case
  // checkJcamp('/misc/nemo_generated.jdx', "Nemo generated JCamp",
  //     {
  //         nbSpectra: 2,
  //         xType: "1H",
  //         observeFrequency: 600.589925054317,
  //         nbPoints: 131072,
  //         firstX: 14.82852,
  //         lastX: -5.183854946422537,
  //         total: 92336803770.80695
  //     }
  // );
});
