'use strict';

var Converter = require('..');
var fs = require('fs');

describe('Test JCAMP options', function () {

    describe("1H NMR ethyl vinyl ether", function () {

        var result = Converter.convert(fs.readFileSync(__dirname + "/data/ethylvinylether/1h.jdx").toString(),
            {keepRecordsRegExp:/^.+$/}
        );

        it('info length', function () {
            Object.keys(result.info).length.should.eql(386);
        });

        it('info solvent', function () {
            result.info['$SOLVENT'].should.eql("<DMSO>");
        });

    });
});