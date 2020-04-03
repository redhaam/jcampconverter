export default function convertToFloatArray(stringArray) {
  let floatArray = [];
  for (let i = 0; i < stringArray.length; i++) {
    floatArray.push(parseFloat(stringArray[i]));
  }
  return floatArray;
}
