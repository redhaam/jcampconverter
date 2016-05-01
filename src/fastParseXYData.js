'use strict';

var DEBUG=true;


module.exports=function(spectrum, value, result) {
    // we check if deltaX is defined otherwise we calculate it
    if (!spectrum.deltaX) {
        spectrum.deltaX = (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
    }
    spectrum.isXYdata = true;
    // TODO to be improved using 2 array {x:[], y:[]}
    var currentData = new Array(100000);
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
    var lastDifference=0;
    var isDuplicate=false;
    var inComment = false;
    var currentValue = 0;
    var isNegative = false;
    var decimalPosition = 0;
    for (; i < value.length; i++) {
        var ascii = value.charCodeAt(i);

        if (inComment) {

        } else {
            // when is it a new value ?
            // when it is not a digit, -, +, . or comma
            if (ascii < 43 && ascii > 57 && ascii !== 47) {
                // need to process the previous value
                if (newLine) {
                    newLine = false;
                } else {
                    // need to deal with duplicate and differences
                    if (isDifference) {
                        lastDifference=isNegative ? -currentValue : currentValue;
                        isDifference=false;
                    }
                    var duplicate=isDuplicate ? 1 : currentValue+1;
                    for (var j=0; j<duplicate; j++) {
                        if (lastDifference!==null) {
                            currentY += lastDifference;
                        } else {
                            currentY = isNegative ? -currentValue : currentValue;
                        }
                        currentData.push(currentX, currentY * spectrum.yFactor);
                        currentX += spectrum.deltaX;
                    }
                }
                // and now analyse the details ... space or tabulation
                if (ascii === 32 || ascii === 9 || ascii === 43) {

                } else
                // positive SQZ digits @ A B C D E F G H I (ascii 64-73)
                if ((ascii > 63) && (ascii < 74)) {
                    currentValue=ascii-64;
                } else
                // negative SQZ digits a b c d e f g h i (ascii 97-105)
                if ((ascii > 96) && (ascii < 106)) {
                    currentValue=ascii-96;
                    isNegative=true;
                } else
                // DUP digits S T U V W X Y Z s (ascii 83-90, 115)
                if (ascii===115) {
                    var isDuplicate=true;
                    currentValue=9;
                } else if ((ascii > 82) && (ascii < 91)) {
                    var isDuplicate=true;
                    currentValue=ascii-82;
                } else
                // positive DIF digits % J K L M N O P Q R (ascii 37, 74-82)
                if (ascii === 37) {
                    isDifference=true;
                    currentValue=0;
                    isNegative=true;
                } else if ((ascii > 73) && (ascii < 83)) {
                    isDifference=true;
                    currentValue=ascii-73;
                } else
                // negative DIF digits j k l m n o p q r (ascii 106-114)
                if ((ascii > 105) && (ascii < 115)) {
                    isDifference=true;
                    currentValue=ascii-105;
                    isNegative=true;
                } else
                // $ sign, we need to check the next one
                if (ascii === 36 && value.charCodeAt(i + 1) === 36) {
                    inComment = true;
                }

            } else { // it is a number that is either new or we continue
                if (ascii >= 48 && ascii <= 57) { // a number
                    if (decimalPosition > 0) {
                        currentValue += (ascii - 48) / Math.pow(10, decimalPosition++);
                    } else {
                        currentValue *= 10;
                        currentValue += ascii - 48;
                    }
                } else if (ascii === 45) { // a "-"
                    isNegative = true;
                } else if (ascii === 44 || ascii === 46) { // a "," or "."
                    decimalPosition++;
                } // if "+" we just don't care
            }
        }


        if (ascii === 13 || ascii === 10) {
            newLine = true;
            inComment = false;
        }
    }
}

