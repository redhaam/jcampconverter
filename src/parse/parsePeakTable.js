const removeCommentRegExp = /\$\$.*/;
const peakTableSplitRegExp = /[,\t ]+/;

export default function parsePeakTable(spectrum, value, result) {
  spectrum.isPeaktable = true;

  if (!spectrum.variables || Object.keys(spectrum.variables) === 2) {
    parseXY(spectrum, value, result);
  } else {
    parseXYZ(spectrum, value, result);
  }

  // we will add the data in the variables
  if (spectrum.variables) {
    for (let key in spectrum.variables) {
      spectrum.variables[key].data = spectrum.data[key];
    }
  }
}

function parseXY(spectrum, value, result) {
  let currentData = { x: [], y: [] };
  spectrum.data = currentData;

  // counts for around 20% of the time
  let lines = value.split(/,? *,?[;\r\n]+ */);

  for (let i = 1; i < lines.length; i++) {
    let values = lines[i]
      .trim()
      .replace(removeCommentRegExp, '')
      .split(peakTableSplitRegExp);
    if (values.length % 2 === 0) {
      for (let j = 0; j < values.length; j = j + 2) {
        // takes around 40% of the time to add and parse the 2 values nearly exclusively because of Number
        currentData.x.push(Number(values[j]) * spectrum.xFactor);
        currentData.y.push(Number(values[j + 1]) * spectrum.yFactor);
      }
    } else {
      result.logs.push(`Format error: ${values}`);
    }
  }
}

function parseXYZ(spectrum, value, result) {
  let currentData = {};
  let variables = Object.keys(spectrum.variables);
  let numberOfVariables = variables.length;
  variables.forEach((variable) => (currentData[variable] = []));
  spectrum.data = currentData;

  // counts for around 20% of the time
  let lines = value.split(/,? *,?[;\r\n]+ */);

  for (let i = 1; i < lines.length; i++) {
    let values = lines[i]
      .trim()
      .replace(removeCommentRegExp, '')
      .split(peakTableSplitRegExp);
    if (values.length % numberOfVariables === 0) {
      for (let j = 0; j < values.length; j++) {
        // todo should try to find a xFactor (y, ...)
        currentData[variables[j % numberOfVariables]].push(Number(values[j]));
      }
    } else {
      result.logs.push(`Format error: ${values}`);
    }
  }
}
