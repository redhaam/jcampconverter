'use strict';

var Benchmark = require('benchmark');

var values=[
    "1",
    "1234",
    "-1234",
    "123456789",
    "1.1",
    "123456789.1",
    "123456789.123456789"
];

var result;

values.forEach(function (value) {
    var suite = new Benchmark.Suite();

    console.log();
    console.log(value);
    
    suite
        .add('manual parse', function () {
            result = manualParse(value);
        })
        .add('parseFloat', function () {
            result = parseFloat(value);
        })
        .add('multiply by 1', function () {
            result = value * 1;
        })
        .add('plus', function () {
            result = +value;
        })
        .add('Number', function () {
            result = Number(value);
        })
        .add('shift 0', function () {
            result = value >> 0;
        })
        .on('cycle', function (event) {
            console.log(String(event.target));
        })
        .run();
});

function manualParse(value) {
    var currentValue=0;
    var decimalPosition=0;
    var isNegative=false;
    for (var j=0; j<value.length; j++) {
        var ascii=value.charCodeAt(j);
        if  ((ascii>47) && (ascii<58)) {
            if (decimalPosition>0) {
                currentValue+=(ascii-48)/Math.pow(10,decimalPosition++);
            } else {
                currentValue*=10;
                currentValue+=ascii-48;
            }
        } else if (ascii===44 || ascii===46) {
            decimalPosition++;
        } else if (ascii===45) {
            isNegative=true;
        }
    }
    return isNegative ? -currentValue : currentValue;
}