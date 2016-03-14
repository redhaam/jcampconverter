'use strict';

var Converter = require('..');
var fs = require('fs');

describe('Test JCAMP converter of GCMS', function () {
    var file = fs.readFileSync(__dirname + '/data/misc/gcms.jdx').toString();

    describe('old format', function () {
        var result = Converter.convert(file);
        var gcms=result.gcms;

        it('Check content', function () {
            gcms.should.keys(['gc','ms']);
            gcms.gc.should.be.type('object');
            gcms.ms.should.be.type('object');
            gcms.gc.tic.should.be.instanceof(Array);
        });

        it('Check length', function () {
            gcms.gc.tic.length.should.be.equal(4840);
            gcms.ms.length.should.be.equal(2420);
        });
    });

    describe('new format', function () {
        var result = Converter.convert(file, {newGCMS: true});
        var gcms=result.gcms;

        it('Check content', function () {
            gcms.should.keys(['times','series']);
            gcms.times.should.be.Array();
            gcms.series.should.be.Array().with.lengthOf(3); // ms, tic, scannumber
        });

        it('Check length', function () {
            gcms.times.length.should.equal(2420);
            gcms.series[0].data.length.should.equal(2420);
        });
    });
});
