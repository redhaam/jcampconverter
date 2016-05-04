'use strict';

var Benchmark = require('benchmark');


var suite = new Benchmark.Suite();

suite
    .add('counter known array size 80000', function() {
        var array=new Array(80000);
        var counter=0;
        for (var i=0; i<10000; i++) {
            array[counter++]=i*2;
            array[counter++]=i*3;
            array[counter++]=i*4;
            array[counter++]=i*5;
        }
    })
    .add('counter very big array size', function() {
        var array=new Array(400000);
        var counter=0;
        for (var i=0; i<10000; i++) {
            array[counter++]=i*2;
            array[counter++]=i*3;
            array[counter++]=i*4;
            array[counter++]=i*5;
        }
        array.length=40000;
    })
    .add('counter too big array size + slice', function() {
        var array=new Array(80000);
        var counter=0;
        for (var i=0; i<10000; i++) {
            array[counter++]=i*2;
            array[counter++]=i*3;
            array[counter++]=i*4;
            array[counter++]=i*5;
        }
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .run();
