'use strict';

var Converter = require('..');
var fs = require('fs');

describe('Test from ACD Jcamp generator', function () {

    it("COSY simulated spectrum", function () {

        var result = Converter.convert(fs.readFileSync(__dirname + "/data/acd/test1_cosy.jdx").toString(),
            {xy:true}
        );
        //console.log(result);
        result.ntuples.length.should.eql(3);
        result.twoD.should.be.true();
        result.contourLines.should.be.obj;

    });
});