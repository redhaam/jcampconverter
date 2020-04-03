import convertTo3DZ from './convertTo3DZ';
import generateContourLines from './generateContourLines';

export default function add2D(result, options) {
  let zData = convertTo3DZ(result.spectra);
  if (!options.noContour) {
    result.contourLines = generateContourLines(zData, options);
    delete zData.z;
  }
  result.minMax = zData;
}
