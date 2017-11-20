'use strict';

var Converter = require('..');
var fs = require('fs');

describe('Test from Mestrec Jcamp generator', function () {
git che
    it.only("NMR 1H spectrum", function () {

        var result = Converter.convert(fs.readFileSync(__dirname + "/data/mestrec/jcamp-256.jdx").toString(),
            {xy:true}
        );
        var data=result.spectra[0].data[0];
        console.log(data.x.length, Math.max(...data.x), Math.min(...data.x));
        console.log(data.y.length, Math.max(...data.y), Math.min(...data.y));
        result.ntuples.length.should.eql(3);
        result.twoD.should.be.true();
        result.contourLines.should.be.obj;

    });
});