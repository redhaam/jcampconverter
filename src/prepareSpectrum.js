export default function prepareSpectrum(spectrum) {
  if (!spectrum.xFactor) spectrum.xFactor = 1;
  if (!spectrum.yFactor) spectrum.yFactor = 1;
  if (spectrum.observeFrequency) {
    if (spectrum.xUnits && spectrum.xUnits.toUpperCase() === 'HZ') {
      spectrum.xUnits = 'PPM';
      spectrum.xFactor = spectrum.xFactor / spectrum.observeFrequency;
      spectrum.firstX = spectrum.firstX / spectrum.observeFrequency;
      spectrum.lastX = spectrum.lastX / spectrum.observeFrequency;
      spectrum.deltaX = spectrum.deltaX / spectrum.observeFrequency;
    }
  }
  if (spectrum.shiftOffsetVal) {
    let shift = spectrum.firstX - spectrum.shiftOffsetVal;
    spectrum.firstX = spectrum.firstX - shift;
    spectrum.lastX = spectrum.lastX - shift;
  }
}
