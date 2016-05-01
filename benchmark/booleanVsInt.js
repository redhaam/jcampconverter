'use strict';

var Benchmark = require('benchmark');


var suite = new Benchmark.Suite();

suite
    .add('boolean', function() {
        var boolean=true;
        var result=0;
        for (var i=0; i<1000; i++) {
            if (boolean) {
                boolean=false;
                result++;
            } else {
                boolean=true;
                result--;
            }
        }
    })
    .add('int', function() {
        var int=1;
        var result=0;
        for (var i=0; i<1000; i++) {
            if (int) {
                int=0;
                result++;
            } else {
                int=1;
                result--;
            }
        }
    })
    .add('int flag null', function() {
        var int=1;
        var result=0;
        var flag=null;
        for (var i=0; i<1000; i++) {
            if (int) {
                int=0;
                result++;
                flag=1;
            } else {
                int=1;
                result--;
                flag=null;
            }
            if (flag>0) {
                result++;
            }
        }
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .run();
