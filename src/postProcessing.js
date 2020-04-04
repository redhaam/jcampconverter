import add2D from './2d/add2D';
import { complexChromatogram } from './complexChromatogram';
import simpleChromatogram from './simpleChromatogram';
import profiling from './profiling';

export default function postProcessing(entriesFlat, result, options) {
  for (let entry of entriesFlat) {
    if (Object.keys(entry.ntuples).length > 0) {
      let newNtuples = [];
      let keys = Object.keys(entry.ntuples);
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let values = entry.ntuples[key];
        for (let j = 0; j < values.length; j++) {
          if (!newNtuples[j]) newNtuples[j] = {};
          newNtuples[j][key] = values[j];
        }
      }
      entry.ntuples = newNtuples;
    }

    if (entry.twoD && options.wantXY) {
      add2D(entry, options);

      profiling(result, 'Finished countour plot calculation', options);

      if (!options.keepSpectra) {
        delete entry.spectra;
      }
    }

    if (options.chromatogram) {
      options.xy = true;
    }

    if (options.xy && options.wantXY) {
      // the spectraData should not be a oneD array but an object with x and y
      if (entry.spectra && entry.spectra.length > 0) {
        for (let spectrum of entry.spectra) {
          if (spectrum.data) {
            let data = spectrum.data;
            let newData = {
              x: new Array(data.length / 2),
              y: new Array(data.length / 2),
            };
            for (let k = 0; k < data.length; k = k + 2) {
              newData.x[k / 2] = data[k];
              newData.y[k / 2] = data[k + 1];
            }
            spectrum.data = newData;
          }
        }
      }
    }

    // maybe it is a GC (HPLC) / MS. In this case we add a new format
    if (options.chromatogram) {
      if (entry.spectra.length > 1) {
        complexChromatogram(entry);
      } else {
        simpleChromatogram(entry);
      }
      profiling(result, 'Finished chromatogram calculation', options);
    }
  }
}
