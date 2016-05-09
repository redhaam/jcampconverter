'use strict';

var Benchmark = require('benchmark');

var jcampBench = require('./jcamp');

var suite = new Benchmark.Suite();

suite
    .add('NMR 1H', jcampBench('indometacin/1h.dx'))
    .add('NMR 1H XY', jcampBench('indometacin/1h.dx', {xy:true}))
    .add('NMR 2D HMBC', jcampBench('indometacin/hmbc.dx'))
    .add('NMR 2D HMBC XY', jcampBench('indometacin/hmbc.dx', {xy:true}))
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .run();
