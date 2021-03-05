import getMedian from 'ml-array-median';

export default function convertTo3DZ(spectra) {
  let minZ = spectra[0].data.y[0];
  let maxZ = minZ;
  let ySize = spectra.length;
  let xSize = spectra[0].data.x.length;

  let z = new Array(ySize);
  for (let i = 0; i < ySize; i++) {
    z[i] = spectra[i].data.y;
    for (let j = 0; j < xSize; j++) {
      let value = z[i][j];
      if (value < minZ) minZ = value;
      if (value > maxZ) maxZ = value;
    }
  }

  const firstX = spectra[0].data.x[0];
  const lastX = spectra[0].data.x[spectra[0].data.x.length - 1]; // has to be -2 because it is a 1D array [x,y,x,y,...]
  const firstY = spectra[0].pageValue;
  const lastY = spectra[ySize - 1].pageValue;

  // Because the min / max value are the only information about the matrix if we invert
  // min and max we need to invert the array
  if (firstX > lastX) {
    for (let spectrum of z) {
      spectrum.reverse();
    }
  }
  if (firstY > lastY) {
    z.reverse();
  }

  const medians = [];
  for (let i = 0; i < z.length; i++) {
    const row = Float64Array.from(z[i]);
    for (let i = 0; i < row.length; i++) {
      if (row[i] < 0) row[i] = -row[i];
    }
    medians.push(getMedian(row));
  }
  const median = getMedian(medians);

  return {
    z: z,
    minX: Math.min(firstX, lastX),
    maxX: Math.max(firstX, lastX),
    minY: Math.min(firstY, lastY),
    maxY: Math.max(firstY, lastY),
    minZ: minZ,
    maxZ: maxZ,
    noise: median,
  };
}
