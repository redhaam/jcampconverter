'use strict';

var Converter = require('..');
var fs = require('fs');


describe('Test fastParseXYData', function () {
    var options={
        fastParse:true
    }
    var result = Converter.convert(fs.readFileSync(__dirname + "/data/compression/jcamp-fix.dx").toString(),options);
    var result2 = Converter.convert(fs.readFileSync(__dirname + "/data/compression/jcamp-packed.dx").toString(),options);
    var result3 = Converter.convert(fs.readFileSync(__dirname + "/data/compression/jcamp-packed.dx").toString(),options);
    var result4 = Converter.convert(fs.readFileSync(__dirname + "/data/compression/jcamp-difdup.dx").toString(),options);
    var result5 = Converter.convert(fs.readFileSync(__dirname + "/data/compression/jcamp-difdup.dx").toString());

    it('It should yield exactly the same data', function () {
        result.spectra.should.eql(result2.spectra);
        result.spectra.should.eql(result3.spectra);
        result.spectra.should.eql(result4.spectra);
        result.spectra.should.eql(result5.spectra);
    });
    /*
    for (var i=0; i<60; i=i+2) {
        console.log(
            result.spectra[0].data[0][i],
            result.spectra[0].data[0][i+1],
            result2.spectra[0].data[0][i],
            result2.spectra[0].data[0][i+1],
            result3.spectra[0].data[0][i],
            result3.spectra[0].data[0][i+1]
        );
    };
    */
});