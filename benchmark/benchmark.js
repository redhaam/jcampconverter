'use strict';

var Benchmark = require('benchmark');

var jcampBench = require('./jcamp');

var suite = new Benchmark.Suite();

suite
    .add('NMR 1H', jcampBench('indometacin/1h.dx'))
    .add('NMR 2D HMBC', jcampBench('indometacin/hmbc.dx'))
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .run();
