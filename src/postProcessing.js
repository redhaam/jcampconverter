import add2D from './2d/add2D';
import { complexChromatogram } from './complexChromatogram';
import postProcessingNMR from './postProcessingNMR';
import profiling from './profiling';
import simpleChromatogram from './simpleChromatogram';

export default function postProcessing(entriesFlat, result, options) {
  // converting Hz to ppm
  postProcessingNMR(entriesFlat);

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

    // maybe it is a GC (HPLC) / MS. In this case we add a new format
    if (options.chromatogram) {
      if (entry.spectra.length > 1) {
        complexChromatogram(entry);
      } else {
        simpleChromatogram(entry);
      }
      profiling(result, 'Finished chromatogram calculation', options);
    }

    delete entry.tmp;
  }
}
