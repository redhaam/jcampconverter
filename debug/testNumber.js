'use strict';

var aNumber="12345";
var aLongNumber="123451234512345";

var counter=0;
var start=new Date().getTime();
for (var i=0; i<1000000; i++) {
    var newValue="";
    for (var j=0; j<aNumber.length; j++) {
        var ascii=aNumber.charCodeAt(j);
        newValue+=String.fromCharCode(ascii);
    }
    counter+=newValue>>0;
}
console.log(counter,new Date().getTime()-start);

var counter=0;
var start=new Date().getTime();
for (var i=0; i<1000000; i++) {
    counter+=aLongNumber.substr(5,5)>>0;
}
console.log(counter,new Date().getTime()-start);



var counter=0;
var start=new Date().getTime();
for (var i=0; i<1000000; i++) {
    var newValue=0;
    var decimal=0;
    for (var j=0; j<aNumber.length; j++) {
        var ascii=aNumber.charCodeAt(j);
        if  ((ascii > 47) && (ascii < 58)) {
            newValue*=10;
            newValue+=ascii-48;
        }
    }
    counter+=newValue;
}
console.log(counter,new Date().getTime()-start);




// + - . 0 1 2 3 4 5 6 7 8 9

if ((ascii === 43) || (ascii === 45) || (ascii === 46) || ((ascii > 47) && (ascii < 58))) {
}

