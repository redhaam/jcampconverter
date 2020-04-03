export default function parsePeakTable(spectrum, value, result) {
  let removeCommentRegExp = /\$\$.*/;
  let peakTableSplitRegExp = /[,\t ]+/;

  spectrum.isPeaktable = true;
  let values;
  let currentData = [];
  spectrum.data = [currentData];

  // counts for around 20% of the time
  let lines = value.split(/,? *,?[;\r\n]+ */);

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
