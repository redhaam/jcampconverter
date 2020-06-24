export default function prepareSpectrum(spectrum) {
  if (!spectrum.xFactor) spectrum.xFactor = 1;
  if (!spectrum.yFactor) spectrum.yFactor = 1;
}
