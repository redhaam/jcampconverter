const removeCommentRegExp = /\$\$.*/;
const peakTableSplitRegExp = /[,\t ]+/;

export default function parsePeakTable(spectrum, value, result) {
  spectrum.isPeaktable = true;

  if (!spectrum.variables || Object.keys(spectrum.variables) === 2) {
    parseXY(spectrum, value, result);
  } else {
    parseXYZ(spectrum, value, result);
  }
}

function parseXY(spectrum, value, result) {
  // counts for around 20% of the time
  let lines = value.split(/,? *,?[;\r\n]+ */);
  let values;
  for (let i = 1; i < lines.length; i++) {
    values = lines[i]
      .trim()
      .replace(removeCommentRegExp, '')
      .split(peakTableSplitRegExp);
    if (values.length % 2 === 0) {
      for (let j = 0; j < values.length; j = j + 2) {
        // takes around 40% of the time to add and parse the 2 values nearly exclusively because of parseFloat
        currentData.push(parseFloat(values[j]) * spectrum.xFactor);
        currentData.push(parseFloat(values[j + 1]) * spectrum.yFactor);
      }
    } else {
      result.logs.push(`Format error: ${values}`);
    }
  }
}

function parseXYZ(spectrum, value, result) {
  let currentData = [];
  spectrum.data = currentData;

  // counts for around 20% of the time
  let lines = value.split(/,? *,?[;\r\n]+ */);

  let values;
  for (let i = 1; i < lines.length; i++) {
    values = lines[i]
      .trim()
      .replace(removeCommentRegExp, '')
      .split(peakTableSplitRegExp);
    if (values.length % 2 === 0) {
      for (let j = 0; j < values.length; j = j + 2) {
        // takes around 40% of the time to add and parse the 2 values nearly exclusively because of parseFloat
        currentData.x.push(parseFloat(values[j]) * spectrum.xFactor);
        currentData.y.push(parseFloat(values[j + 1]) * spectrum.yFactor);
      }
    } else {
      result.logs.push(`Format error: ${values}`);
    }
  }
}
