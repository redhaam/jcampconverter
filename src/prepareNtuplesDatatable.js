export default function prepareNtuplesDatatable(currentEntry, spectrum, kind) {
  let xIndex = -1;
  let yIndex = -1;
  let firstVariable = '';
  let secondVariable = '';
  if (kind.indexOf('++') > 0) {
    firstVariable = kind.replace(/.*\(([a-zA-Z0-9]+)\+\+.*/, '$1');
    secondVariable = kind.replace(/.*\.\.([a-zA-Z0-9]+).*/, '$1');
  } else {
    kind = kind.replace(/[^a-zA-Z]/g, '');
    firstVariable = kind.charAt(0);
    secondVariable = kind.charAt(1);
    spectrum.variables = {};
    for (let symbol of kind) {
      let lowerCaseSymbol = symbol.toLowerCase();
      let index = currentEntry.ntuples.symbol.indexOf(symbol);
      if (index === -1) throw Error(`Symbol undefined: ${symbol}`);
      spectrum.variables[lowerCaseSymbol] = {};
      for (let key in currentEntry.ntuples) {
        if (currentEntry.ntuples[key][index]) {
          spectrum.variables[lowerCaseSymbol][key.replace(/^var/, '')] =
            currentEntry.ntuples[key][index];
        }
      }
    }
  }
  xIndex = currentEntry.ntuples.symbol.indexOf(firstVariable);
  yIndex = currentEntry.ntuples.symbol.indexOf(secondVariable);

  if (xIndex === -1) xIndex = 0;
  if (yIndex === -1) yIndex = 0;

  if (currentEntry.ntuples.first) {
    if (currentEntry.ntuples.first.length > xIndex) {
      spectrum.firstX = currentEntry.ntuples.first[xIndex];
    }
    if (currentEntry.ntuples.first.length > yIndex) {
      spectrum.firstY = currentEntry.ntuples.first[yIndex];
    }
  }
  if (currentEntry.ntuples.last) {
    if (currentEntry.ntuples.last.length > xIndex) {
      spectrum.lastX = currentEntry.ntuples.last[xIndex];
    }
    if (currentEntry.ntuples.last.length > yIndex) {
      spectrum.lastY = currentEntry.ntuples.last[yIndex];
    }
  }
  if (
    currentEntry.ntuples.vardim &&
    currentEntry.ntuples.vardim.length > xIndex
  ) {
    spectrum.nbPoints = currentEntry.ntuples.vardim[xIndex];
  }
  if (currentEntry.ntuples.factor) {
    if (currentEntry.ntuples.factor.length > xIndex) {
      spectrum.xFactor = currentEntry.ntuples.factor[xIndex];
    }
    if (currentEntry.ntuples.factor.length > yIndex) {
      spectrum.yFactor = currentEntry.ntuples.factor[yIndex];
    }
  }
  if (currentEntry.ntuples.units) {
    if (currentEntry.ntuples.units.length > xIndex) {
      if (
        currentEntry.ntuples.varname &&
        currentEntry.ntuples.varname[xIndex]
      ) {
        spectrum.xUnits = `${currentEntry.ntuples.varname[xIndex]} [${currentEntry.ntuples.units[xIndex]}]`;
      } else {
        spectrum.xUnits = currentEntry.ntuples.units[xIndex];
      }
    }
    if (currentEntry.ntuples.units.length > yIndex) {
      if (
        currentEntry.ntuples.varname &&
        currentEntry.ntuples.varname[yIndex]
      ) {
        spectrum.yUnits = `${currentEntry.ntuples.varname[yIndex]} [${currentEntry.ntuples.units[yIndex]}]`;
      } else {
        spectrum.yUnits = currentEntry.ntuples.units[yIndex];
      }
    }
  }
}
