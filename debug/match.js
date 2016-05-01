'use strict';


var test="11861i1670l81p3M614o704n674N826N79j165J1715o312j1376J3930K60r300N177";
//var test="123+456-789   1  2  3  -4  -5  -6"



var reg = /(\$\$.*|[,;\t \+]*|[,;\t \+-]*[,;\t \+])([a-zA-Z@%\-+]?[\d,\.]*)/g
var result;
var start=new Date().getTime();
var counter=0;

var reg = /(\$\$.*|[,;\t \+]*|[,;\t \+-]*[,;\t \+])([a-zA-Z@%\-+]?[\d,\.]*)/g

for (var i=0; i<100000; i++) {
    while (result = reg.exec(test)) {
        if (result[0] === '') break;
        parseValue(result[2]);
        counter++;
    }
    reg.exec();
}
console.log(counter,new Date().getTime()-start);

var xyDataSplitRegExp = /[,\t \+-]*(?=[^\d,\t \.])|[ \t]+(?=[\d+\.-])/;
var removeCommentRegExp = /\$\$.*/;
var start=new Date().getTime();
var counter=0;
for (var i=0; i<100000; i++) {
    var values = test.trim().replace(removeCommentRegExp, '').split(xyDataSplitRegExp);
    counter+=values.length;
    for (var j=0; j<values.length; j++) {
        parseValue(values[j]);
    }
}
console.log(counter,new Date().getTime()-start);

var start=new Date().getTime();
var counter=0;
for (var i=0; i<1000000; i++) {
    counter+=testScan(test);
}
console.log(counter,new Date().getTime()-start);




var currentX, currentY, lastDif, ascii;
function parseValue(value) {
    if (value.length > 0) {
        ascii = value.charCodeAt(0);
         // + - . 0 1 2 3 4 5 6 7 8 9
        if ((ascii === 43) || (ascii === 45) || (ascii === 46) || ((ascii > 47) && (ascii < 58))) {
            lastDif = null;
            currentY = parseFloat(value);
            return currentY;
            currentX += spectrum.deltaX;
        } else
        // positive SQZ digits @ A B C D E F G H I (ascii 64-73)
        if ((ascii > 63) && (ascii < 74)) {
            lastDif = null;
            currentY = parseFloat(String.fromCharCode(ascii - 16) + value.substring(1));
            return currentY;
            currentX += spectrum.deltaX;
        } else
        // negative SQZ digits a b c d e f g h i (ascii 97-105)
        if ((ascii > 96) && (ascii < 106)) {
            lastDif = null;
            currentY = -parseFloat(String.fromCharCode(ascii - 48) + value.substring(1));
            return currentY;
            currentX += spectrum.deltaX;
        } else



        // DUP digits S T U V W X Y Z s (ascii 83-90, 115)
        if (((ascii > 82) && (ascii < 91)) || (ascii === 115)) {
            var dup = parseFloat(String.fromCharCode(ascii - 34) + value.substring(1)) - 1;
            if (ascii === 115) {
                dup = parseFloat('9' + value.substring(1)) - 1;
            }
            for (var l = 0; l < dup; l++) {
                if (lastDif) {
                    currentY = currentY + lastDif;
                }
                return currentY;
                currentX += spectrum.deltaX;
            }
        } else
        // positive DIF digits % J K L M N O P Q R (ascii 37, 74-82)
        if (ascii === 37) {
            lastDif = parseFloat('0' + value.substring(1));
            currentY += lastDif;
            return currentY;
            currentX += spectrum.deltaX;
        } else if ((ascii > 73) && (ascii < 83)) {
            lastDif = parseFloat(String.fromCharCode(ascii - 25) + value.substring(1));
            currentY += lastDif;
            return currentY;
            currentX += spectrum.deltaX;
        } else
        // negative DIF digits j k l m n o p q r (ascii 106-114)
        if ((ascii > 105) && (ascii < 115)) {
            return currentY;
            currentX += spectrum.deltaX;
        }
    }
}

function testScan(value) {
    var ascii;
    var counter=0;
    var newValue="";
    for (var i=0; i<value.length; i++) {
        ascii = value.charCodeAt();
        newValue+=String.fromCharCode(ascii);

        // + - . 0 1 2 3 4 5 6 7 8 9
        if ((ascii === 43) || (ascii === 45) || (ascii === 46) || ((ascii > 47) && (ascii < 58))) {
            counter+=1;
        } else
        // positive SQZ digits @ A B C D E F G H I (ascii 64-73)
        if ((ascii > 63) && (ascii < 74)) {
            counter+=2;
        } else
        // negative SQZ digits a b c d e f g h i (ascii 97-105)
        if ((ascii > 96) && (ascii < 106)) {
            counter+=3;
        } else
        // DUP digits S T U V W X Y Z s (ascii 83-90, 115)
        if (((ascii > 82) && (ascii < 91)) || (ascii === 115)) {
            counter+=4;
        } else
        // positive DIF digits % J K L M N O P Q R (ascii 37, 74-82)
        if (ascii === 37) {
            counter+=5;
        } else if ((ascii > 73) && (ascii < 83)) {
            counter+=6;
        } else
        // negative DIF digits j k l m n o p q r (ascii 106-114)
        if ((ascii > 105) && (ascii < 115)) {
            counter+=7;
        }
    }
    counter+=newValue.length;
    return counter;
}

