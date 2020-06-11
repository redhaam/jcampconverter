export default function fastParseXYData(spectrum, value) {
  // TODO need to deal with result
  //  console.log(value);
  // we check if deltaX is defined otherwise we calculate it

  let yFactor = spectrum.yFactor;
  let deltaX = spectrum.deltaX;

  spectrum.isXYdata = true;
  let currentData = { x: [], y: [] };
  spectrum.data = currentData;

  let currentX = spectrum.firstX;
  let currentY = spectrum.firstY;

  // we skip the first line
  //
  let endLine = false;
  let ascii;
  let i = 0;
  for (; i < value.length; i++) {
    ascii = value.charCodeAt(i);
    if (ascii === 13 || ascii === 10) {
      endLine = true;
    } else {
      if (endLine) break;
    }
  }

  // we proceed taking the i after the first line
  let newLine = true;
  let isDifference = false;
  let isLastDifference = false;
  let lastDifference = 0;
  let isDuplicate = false;
  let inComment = false;
  let currentValue = 0; // can be a difference or a duplicate
  let lastValue = 0; // must be the real last value
  let isNegative = false;
  let inValue = false;
  let skipFirstValue = false;
  let decimalPosition = 0;
  for (; i <= value.length; i++) {
    if (i === value.length) ascii = 13;
    else ascii = value.charCodeAt(i);
    if (inComment) {
      // we should ignore the text if we are after $$
      if (ascii === 13 || ascii === 10) {
        newLine = true;
        inComment = false;
      }
    } else {
      // when is it a new value ?
      // when it is not a digit, . or comma
      // it is a number that is either new or we continue
      if (ascii <= 57 && ascii >= 48) {
        // a number
        inValue = true;
        if (decimalPosition > 0) {
          currentValue += (ascii - 48) / Math.pow(10, decimalPosition++);
        } else {
          currentValue *= 10;
          currentValue += ascii - 48;
        }
      } else if (ascii === 44 || ascii === 46) {
        // a "," or "."
        inValue = true;
        decimalPosition++;
      } else {
        if (inValue) {
          // need to process the previous value
          if (newLine) {
            newLine = false; // we don't check the X value
            // console.log("NEW LINE",isDifference, lastDifference);
            // if new line and lastDifference, the first value is just a check !
            // that we don't check ...
            if (isLastDifference) skipFirstValue = true;
          } else {
            // need to deal with duplicate and differences
            if (skipFirstValue) {
              skipFirstValue = false;
            } else {
              if (isDifference) {
                lastDifference = isNegative ? 0 - currentValue : currentValue;
                isLastDifference = true;
                isDifference = false;
              } else if (!isDuplicate) {
                lastValue = isNegative ? 0 - currentValue : currentValue;
              }
              let duplicate = isDuplicate ? currentValue - 1 : 1;
              for (let j = 0; j < duplicate; j++) {
                if (isLastDifference) {
                  currentY += lastDifference;
                } else {
                  currentY = lastValue;
                }
                currentData.x.push(currentX);
                currentData.y.push(currentY * yFactor);
                currentX += deltaX;
              }
            }
          }
          isNegative = false;
          currentValue = 0;
          decimalPosition = 0;
          inValue = false;
          isDuplicate = false;
        }

        // positive SQZ digits @ A B C D E F G H I (ascii 64-73)
        if (ascii < 74 && ascii > 63) {
          inValue = true;
          isLastDifference = false;
          currentValue = ascii - 64;
        } else if (ascii > 96 && ascii < 106) {
          // negative SQZ digits a b c d e f g h i (ascii 97-105)
          inValue = true;
          isLastDifference = false;
          currentValue = ascii - 96;
          isNegative = true;
        } else if (ascii === 115) {
          // DUP digits S T U V W X Y Z s (ascii 83-90, 115)
          inValue = true;
          isDuplicate = true;
          currentValue = 9;
        } else if (ascii > 82 && ascii < 91) {
          inValue = true;
          isDuplicate = true;
          currentValue = ascii - 82;
        } else if (ascii > 73 && ascii < 83) {
          // positive DIF digits % J K L M N O P Q R (ascii 37, 74-82)
          inValue = true;
          isDifference = true;
          currentValue = ascii - 73;
        } else if (ascii > 105 && ascii < 115) {
          // negative DIF digits j k l m n o p q r (ascii 106-114)
          inValue = true;
          isDifference = true;
          currentValue = ascii - 105;
          isNegative = true;
        } else if (ascii === 36 && value.charCodeAt(i + 1) === 36) {
          // $ sign, we need to check the next one
          inValue = true;
          inComment = true;
        } else if (ascii === 37) {
          // positive DIF digits % J K L M N O P Q R (ascii 37, 74-82)
          inValue = true;
          isDifference = true;
          currentValue = 0;
          isNegative = false;
        } else if (ascii === 45) {
          // a "-"
          // check if after there is a number, decimal or comma
          let ascii2 = value.charCodeAt(i + 1);
          if (
            (ascii2 >= 48 && ascii2 <= 57) ||
            ascii2 === 44 ||
            ascii2 === 46
          ) {
            inValue = true;
            if (!newLine) isLastDifference = false;
            isNegative = true;
          }
        } else if (ascii === 13 || ascii === 10) {
          newLine = true;
          inComment = false;
        }
        // and now analyse the details ... space or tabulation
        // if "+" we just don't care
      }
    }
  }
}
