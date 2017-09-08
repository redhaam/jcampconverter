'use strict';

var Converter = require('..');
var fs = require('fs');

describe.only('Test from Mestrec Jcamp generator with assignment', function () {

    it("should give 5 spectra", function () {

        var result = Converter.convert(fs.readFileSync(__dirname + "/data/mestrec.jdx").toString());
        console.log(result.spectra.length);
       // result.ntuples.length.should.eql(3);
       // result.twoD.should.be.true();
       // result.contourLines.should.be.obj;

    });
});