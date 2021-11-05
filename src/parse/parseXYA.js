export default function parseXYA(spectrum, value) {
  let removeSymbolRegExp = /(\(+|\)+|<+|>+|\s+)/g;

  spectrum.isXYAdata = true;
  let values;
  let currentData = { x: [], y: [] };
  spectrum.data = currentData;

  let lines = value.split(/,? *,?[;\r\n]+ */);

  for (let i = 1; i < lines.length; i++) {
    values = lines[i].trim().replace(removeSymbolRegExp, '').split(',');
    currentData.x.push(Number(values[0]));
    currentData.y.push(Number(values[1]));
  }
}
