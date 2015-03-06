'use strict';

var Converter = require('..');
var fs = require('fs');

describe('Test conversion option for jcamp', function () {

    describe("1H NMR ethyl vinyl ether", function () {

        var result = Converter.convert(fs.readFileSync(__dirname + "/data/misc/iv.jdx").toString(),
            {xy:true}
        );


        var x=result.spectra[0].data[0].x;
        var y=result.spectra[0].data[0].y;

        it('Check X and Y llength', function () {
            x.length.should.eql(302);
            y.length.should.eql(302);
        });

        var type=result.spectra[0];
        it('Check type is peak table', function () {
            type.should.not.have.property("isXYdata");
            type.isPeaktable.should.be.true;
        });

    });
});