import { gyromagneticRatio } from 'nmr-processing';

export default function postProcessingNMR(entriesFlat) {
  // specific NMR functions

  for (let entry of entriesFlat) {
    let observeFrequency = 0;
    let shiftOffsetVal = 0;
    for (let spectrum of entry.spectra) {
      if (entry.ntuples && entry.ntuples.symbol) {
        if (!observeFrequency && spectrum.observeFrequency) {
          observeFrequency = spectrum.observeFrequency;
        }
        if (!shiftOffsetVal && spectrum.shiftOffsetVal) {
          shiftOffsetVal = spectrum.shiftOffsetVal;
        }
      } else {
        observeFrequency = spectrum.observeFrequency;
        shiftOffsetVal = spectrum.shiftOffsetVal;
      }

      if (observeFrequency) {
        if (spectrum.xUnits && spectrum.xUnits.toUpperCase().includes('HZ')) {
          spectrum.xUnits = 'PPM';
          spectrum.xFactor = spectrum.xFactor / observeFrequency;
          spectrum.firstX = spectrum.firstX / observeFrequency;
          spectrum.lastX = spectrum.lastX / observeFrequency;
          spectrum.deltaX = spectrum.deltaX / observeFrequency;
          for (let i = 0; i < spectrum.data.x.length; i++) {
            spectrum.data.x[i] /= observeFrequency;
          }
        }
      }
      if (shiftOffsetVal) {
        let shift = spectrum.firstX - shiftOffsetVal;
        spectrum.firstX = spectrum.firstX - shift;
        spectrum.lastX = spectrum.lastX - shift;
        for (let i = 0; i < spectrum.data.x.length; i++) {
          spectrum.data.x[i] -= shift;
        }
      }

      // we will check if some nucleus are missing ...
      if (entry.ntuples && entry.ntuples.nucleus && entry.ntuples.symbol) {
        for (let i = 0; i < entry.ntuples.nucleus.length; i++) {
          let symbol = entry.ntuples.symbol[i];
          let nucleus = entry.ntuples.nucleus[i];
          if (symbol.startsWith('F') && !nucleus) {
            if (symbol === 'F1') {
              // if F1 is defined we will use F2
              if (entry.tmp.$NUC2) {
                entry.ntuples.nucleus[i] = entry.tmp.$NUC2;
              } else {
                let f2index = entry.ntuples.symbol.indexOf('F2');
                if (f2index && entry.ntuples.nucleus[f2index]) {
                  entry.ntuples.nucleus[i] = entry.ntuples.nucleus[f2index];
                }
              }
            }
            if (symbol === 'F2') entry.ntuples.nucleus[i] = entry.tmp.$NUC1;
          }
          if (symbol === 'F2') {
            entry.yType = entry.ntuples.nucleus[0];
          }
        }
      }

      if (
        observeFrequency &&
        entry.ntuples &&
        entry.ntuples.symbol &&
        entry.ntuples.nucleus
      ) {
        let unit = '';
        let pageSymbolIndex = entry.ntuples.symbol.indexOf(spectrum.pageSymbol);
        if (entry.ntuples.units && entry.ntuples.units[pageSymbolIndex]) {
          unit = entry.ntuples.units[pageSymbolIndex];
        }
        if (unit !== 'PPM') {
          if (pageSymbolIndex !== 0) {
            throw Error('Not sure about this ntuples format');
          }

          let ratio0 = gyromagneticRatio[entry.ntuples.nucleus[0]];
          let ratio1 = gyromagneticRatio[entry.ntuples.nucleus[1]];
          if (!ratio0 || !ratio1) {
            throw Error('Problem with determination of gyromagnetic ratio');
          }
          let ratio = (ratio0 / ratio1) * observeFrequency;
          spectrum.pageValue /= ratio;
        }
      }
    }
  }
}
