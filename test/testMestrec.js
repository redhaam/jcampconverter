'use strict';

var Converter = require('..');
var fs = require('fs');

describe('Test from Mestrec Jcamp generator', function () {

    it("NMR 1H spectrum", function () {

        var result = Converter.convert(fs.readFileSync(__dirname + "/data/mestrec/jcamp-256.jdx").toString(),
            {xy:true}
        );
        var data=result.spectra[0].data[0];
        data.x.length.should.eql(256);
        data.y.length.should.eql(256);
        console.log(data.x.length, Math.max(...data.x), Math.min(...data.x));
        console.log(data.y.length, Math.max(...data.y), Math.min(...data.y));


    });
});