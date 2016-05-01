'use strict';

var DEBUG=true;


module.exports=function(spectrum, value, result) {
    // TODO need to deal with result
  //  console.log(value);
    // we check if deltaX is defined otherwise we calculate it
    if (!spectrum.deltaX) {
        spectrum.deltaX = (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
    }
    spectrum.isXYdata = true;
    // TODO to be improved using 2 array {x:[], y:[]}
    var currentData = [];
    var currentPosition = 0;
    spectrum.data = [currentData];


    var currentX = spectrum.firstX;
    var currentY = spectrum.firstY;

    // we skip the first line
    //
    var endLine = false;
    for (var i = 0; i < value.length; i++) {
        var ascii = value.charCodeAt(i);
        if (ascii === 13 || ascii === 10) {
            endLine = true;
        } else {
            if (endLine) break;
        }
    }

    // we proceed taking the i after the first line
    var newLine = true;
    var isDifference=false;
    var lastDifference=null;
    var isDuplicate=false;
    var inComment = false;
    var currentValue = 0;
    var isNegative = false;
    var inValue=false;
    var skipFirstValue=false;
    var decimalPosition = 0;
    for (; i <= value.length; i++) {
        var ascii = value.charCodeAt(i);
        if (inComment) {
            // we should ignore the text if we are after $$
        } else {
            // when is it a new value ?
            // when it is not a digit, . or comma
            // it is a number that is either new or we continue
            if (ascii >= 48 && ascii <= 57) { // a number
                inValue=true;
                if (decimalPosition > 0) {
                    currentValue += (ascii - 48) / Math.pow(10, decimalPosition++);
                } else {
                    currentValue *= 10;
                    currentValue += ascii - 48;
                }
            } else if (ascii === 44 || ascii === 46) { // a "," or "."
                inValue=true;
                decimalPosition++;
            } else {
                if (inValue) {
                    // need to process the previous value
                    if (newLine) {
                        newLine = false; // we don't check the X value
                       // console.log("NEW LINE",isDifference, lastDifference);
                        // if new line and lastDifference, the first value is just a check !
                        // that we don't check ...
                        if (lastDifference) skipFirstValue=true;
                    } else {
                        // need to deal with duplicate and differences
                        if (skipFirstValue) {
                            skipFirstValue=false;
                        } else {
                            if (isDifference) {
                                lastDifference=isNegative ? -currentValue : currentValue;
                                isDifference=false;
                            }
                            var duplicate=isDuplicate ? currentValue - 1 : 1;
                            for (var j=0; j<duplicate; j++) {
                                if (lastDifference!==null) {
                                    currentY += lastDifference;
                                } else {
                                    currentY = isNegative ? -currentValue : currentValue;
                                }

                              //  console.log("Separator",isNegative ?
                              //          -currentValue : currentValue,
                              //      "isDiff", isDifference, "isDup", isDuplicate,
                              //      "lastDif", lastDifference, "dup:", duplicate, "y", currentY);

                                // push is slightly slower ... (we loose 10%)
                                currentData[currentPosition++]=currentX;
                                currentData[currentPosition++]=currentY * spectrum.yFactor;
                                currentX += spectrum.deltaX;
                            }
                        }
                    }
                    isNegative=false;
                    currentValue=0;
                    decimalPosition=0;
                    inValue=false;
                    isDuplicate=false;
                }

                // positive SQZ digits @ A B C D E F G H I (ascii 64-73)
                if ((ascii > 63) && (ascii < 74)) {
                    inValue=true;
                    lastDifference=null;
                    currentValue=ascii-64;
                } else
                // negative SQZ digits a b c d e f g h i (ascii 97-105)
                if ((ascii > 96) && (ascii < 106)) {
                    inValue=true;
                    lastDifference=null;
                    currentValue=ascii-96;
                    isNegative=true;
                } else
                // DUP digits S T U V W X Y Z s (ascii 83-90, 115)
                if (ascii===115) {
                    inValue=true;
                    isDuplicate=true;
                    currentValue=9;
                } else if ((ascii > 82) && (ascii < 91)) {
                    inValue=true;
                    isDuplicate=true;
                    currentValue=ascii-82;
                } else
                // positive DIF digits % J K L M N O P Q R (ascii 37, 74-82)
                if (ascii === 37) {
                    inValue=true;
                    isDifference=true;
                    currentValue=0;
                    isNegative=true;
                } else if ((ascii > 73) && (ascii < 83)) {
                    inValue=true;
                    isDifference=true;
                    currentValue=ascii-73;
                } else
                // negative DIF digits j k l m n o p q r (ascii 106-114)
                if ((ascii > 105) && (ascii < 115)) {
                    inValue=true;
                    isDifference=true;
                    currentValue=ascii-105;
                    isNegative=true;
                } else
                // $ sign, we need to check the next one
                if (ascii === 36 && value.charCodeAt(i + 1) === 36) {
                    inValue=true;
                    inComment = true;
                } else if (ascii === 45) { // a "-"
                    // check if after there is a number, decimal or comma
                    let ascii2=value.charCodeAt(i+1);
                    if ((ascii2 >= 48 && ascii2 <= 57) || ascii2 === 44 || ascii2 === 46) {
                        inValue=true;
                        lastDifference=null;
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

