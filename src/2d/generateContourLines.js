export default function generateContourLines(zData, options) {
  let noise = zData.noise;
  let z = zData.z;
  let povarHeight0, povarHeight1, povarHeight2, povarHeight3;
  let isOver0, isOver1, isOver2, isOver3;
  let nbSubSpectra = z.length;
  let nbPovars = z[0].length;
  let pAx, pAy, pBx, pBy;

  let x0 = zData.minX;
  let xN = zData.maxX;
  let dx = (xN - x0) / (nbPovars - 1);
  let y0 = zData.minY;
  let yN = zData.maxY;
  let dy = (yN - y0) / (nbSubSpectra - 1);
  let minZ = zData.minZ;
  let maxZ = zData.maxZ;

  // System.out.prvarln('y0 '+y0+' yN '+yN);
  // -------------------------
  // Povars attribution
  //
  // 0----1
  // |  / |
  // | /  |
  // 2----3
  //
  // ---------------------d------

  let iter = options.nbContourLevels * 2;
  let contourLevels = new Array(iter);
  let lineZValue;
  for (let level = 0; level < iter; level++) {
    // multiply by 2 for positif and negatif
    let contourLevel = {};
    contourLevels[level] = contourLevel;
    let side = level % 2;
    let factor =
      (maxZ - options.noiseMultiplier * noise) *
      Math.exp((level >> 1) - options.nbContourLevels);
    if (side === 0) {
      lineZValue = factor + options.noiseMultiplier * noise;
    } else {
      lineZValue = 0 - factor - options.noiseMultiplier * noise;
    }
    let lines = [];
    contourLevel.zValue = lineZValue;
    contourLevel.lines = lines;

    if (lineZValue <= minZ || lineZValue >= maxZ) continue;

    for (let iSubSpectra = 0; iSubSpectra < nbSubSpectra - 1; iSubSpectra++) {
      let subSpectra = z[iSubSpectra];
      let subSpectraAfter = z[iSubSpectra + 1];
      for (let povar = 0; povar < nbPovars - 1; povar++) {
        povarHeight0 = subSpectra[povar];
        povarHeight1 = subSpectra[povar + 1];
        povarHeight2 = subSpectraAfter[povar];
        povarHeight3 = subSpectraAfter[povar + 1];

        isOver0 = povarHeight0 > lineZValue;
        isOver1 = povarHeight1 > lineZValue;
        isOver2 = povarHeight2 > lineZValue;
        isOver3 = povarHeight3 > lineZValue;

        // Example povar0 is over the plane and povar1 and
        // povar2 are below, we find the varersections and add
        // the segment
        if (isOver0 !== isOver1 && isOver0 !== isOver2) {
          pAx =
            povar + (lineZValue - povarHeight0) / (povarHeight1 - povarHeight0);
          pAy = iSubSpectra;
          pBx = povar;
          pBy =
            iSubSpectra +
            (lineZValue - povarHeight0) / (povarHeight2 - povarHeight0);
          lines.push(pAx * dx + x0);
          lines.push(pAy * dy + y0);
          lines.push(pBx * dx + x0);
          lines.push(pBy * dy + y0);
        }
        // remove push does not help !!!!
        if (isOver3 !== isOver1 && isOver3 !== isOver2) {
          pAx = povar + 1;
          pAy =
            iSubSpectra +
            1 -
            (lineZValue - povarHeight3) / (povarHeight1 - povarHeight3);
          pBx =
            povar +
            1 -
            (lineZValue - povarHeight3) / (povarHeight2 - povarHeight3);
          pBy = iSubSpectra + 1;
          lines.push(pAx * dx + x0);
          lines.push(pAy * dy + y0);
          lines.push(pBx * dx + x0);
          lines.push(pBy * dy + y0);
        }
        // test around the diagonal
        if (isOver1 !== isOver2) {
          pAx =
            (povar +
              1 -
              (lineZValue - povarHeight1) / (povarHeight2 - povarHeight1)) *
              dx +
            x0;
          pAy =
            (iSubSpectra +
              (lineZValue - povarHeight1) / (povarHeight2 - povarHeight1)) *
              dy +
            y0;
          if (isOver1 !== isOver0) {
            pBx =
              povar +
              1 -
              (lineZValue - povarHeight1) / (povarHeight0 - povarHeight1);
            pBy = iSubSpectra;
            lines.push(pAx);
            lines.push(pAy);
            lines.push(pBx * dx + x0);
            lines.push(pBy * dy + y0);
          }
          if (isOver2 !== isOver0) {
            pBx = povar;
            pBy =
              iSubSpectra +
              1 -
              (lineZValue - povarHeight2) / (povarHeight0 - povarHeight2);
            lines.push(pAx);
            lines.push(pAy);
            lines.push(pBx * dx + x0);
            lines.push(pBy * dy + y0);
          }
          if (isOver1 !== isOver3) {
            pBx = povar + 1;
            pBy =
              iSubSpectra +
              (lineZValue - povarHeight1) / (povarHeight3 - povarHeight1);
            lines.push(pAx);
            lines.push(pAy);
            lines.push(pBx * dx + x0);
            lines.push(pBy * dy + y0);
          }
          if (isOver2 !== isOver3) {
            pBx =
              povar +
              (lineZValue - povarHeight2) / (povarHeight3 - povarHeight2);
            pBy = iSubSpectra + 1;
            lines.push(pAx);
            lines.push(pAy);
            lines.push(pBx * dx + x0);
            lines.push(pBy * dy + y0);
          }
        }
      }
    }
  }

  return {
    minX: zData.minX,
    maxX: zData.maxX,
    minY: zData.minY,
    maxY: zData.maxY,
    segments: contourLevels,
  };
}
