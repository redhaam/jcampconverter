const GC_MS_FIELDS = ['TIC', '.RIC', 'SCANNUMBER'];

export function complexChromatogram(result) {
  let spectra = result.spectra;
  let length = spectra.length;
  let chromatogram = {
    times: new Array(length),
    series: {
      ms: {
        dimension: 2,
        data: new Array(length),
      },
    },
  };

  let existingGCMSFields = [];
  for (let i = 0; i < GC_MS_FIELDS.length; i++) {
    let label = convertMSFieldToLabel(GC_MS_FIELDS[i]);
    if (spectra[0][label]) {
      existingGCMSFields.push(label);
      chromatogram.series[label] = {
        dimension: 1,
        data: new Array(length),
      };
    }
  }

  for (let i = 0; i < length; i++) {
    let spectrum = spectra[i];
    chromatogram.times[i] = spectrum.pageValue;
    for (let j = 0; j < existingGCMSFields.length; j++) {
      chromatogram.series[existingGCMSFields[j]].data[i] = Number(
        spectrum[existingGCMSFields[j]],
      );
    }
    if (spectrum.data) {
      chromatogram.series.ms.data[i] = [spectrum.data.x, spectrum.data.y];
    }
  }
  result.chromatogram = chromatogram;
}

export function isMSField(canonicDataLabel) {
  return GC_MS_FIELDS.indexOf(canonicDataLabel) !== -1;
}

export function convertMSFieldToLabel(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}
