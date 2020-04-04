export default function parseXYA(spectrum, value) {
  let removeSymbolRegExp = /(\(+|\)+|<+|>+|\s+)/g;

  spectrum.isXYAdata = true;
  let values;
  let currentData = [];
  spectrum.data = currentData;

  let lines = value.split(/,? *,?[;\r\n]+ */);

  for (let i = 1; i < lines.length; i++) {
    values = lines[i]
      .trim()
      .replace(removeSymbolRegExp, '')
      .split(',');
    currentData.push(parseFloat(values[0]));
    currentData.push(parseFloat(values[1]));
  }
}
