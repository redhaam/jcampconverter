'use strict';

var Converter = require('..');
var fs = require('fs');

function checkJcamp(filename, label, data) {

    describe(label, function () {

        var result = Converter.convert(fs.readFileSync(__dirname + filename).toString());

        it('xAxis type', function () {
            result.xType.should.eql(data.xType);
        });

        if (result.spectra) {
            it('Number of spectra present', function () {
                result.spectra.length.should.eql(data.nbSpectra);
            });
            it('Spectrum data', function () {
                var spectrum = result.spectra[0];
                spectrum.observeFrequency.should.eql(data.observeFrequency);
                spectrum.nbPoints.should.eql(data.nbPoints);
                spectrum.firstX.should.eql(data.firstX);
                spectrum.lastX.should.eql(data.lastX);
                spectrum.data[0].reduce(function (a, b) {
                    return a + b
                }).should.eql(data.total);
            });
        }

    });

}

describe('Test JCAMP converter', function () {

    checkJcamp('/data/ethylvinylether/1h.jdx', "1H NMR Ethyl vinyl ether",
        {
            nbSpectra: 2,
            xType: "1H",
            observeFrequency: 400.112,
            nbPoints: 16384,
            firstX: 11.00659,
            lastX: -1.009276326659311,
            total: 10199322812.993612
        }
    );

    describe('All those compressions should give exactly the dame result', function () {

        var options = {
            nbSpectra: 1,
            xType: "1H",
            observeFrequency: 400.1321303162,
            nbPoints: 16384,
            firstX: 12.31284,
            lastX: -1.6646457842364946,
            total: 11044828778.007011
        };

        checkJcamp('/data/compression/jcamp-fix.dx', "Compression fixed", options);
        checkJcamp('/data/compression/jcamp-packed.dx', "Compression packed", options);
        checkJcamp('/data/compression/jcamp-squeezed.dx', "Compression squeezed", options);
        checkJcamp('/data/compression/jcamp-difdup.dx', "Compression difdup", options);

    });

    checkJcamp('/data/indometacin/1h.dx', "1H NMR Indometacin",
        {
            nbSpectra: 1,
            xType: "1H",
            observeFrequency: 399.682468187609,
            nbPoints: 32768,
            firstX: 16.46138,
            lastX: -4.114164000759506,
            total: 34968303169.78704
        }
    );

    checkJcamp('/data/indometacin/cosy.dx', "COSY Indometacin",
        {
            nbSpectra: 1024,
            xType: "1H",
            observeFrequency: 399.682944878731,
            nbPoints: 1024,
            firstX: 13.42727,
            lastX: 1.3052585346869103,
            total: 543213.05460976
        }
    );

    checkJcamp('/data/indometacin/hsqc.dx', "HSQC Indometacin",
        {
            nbSpectra: 1024,
            xType: "1H",
            observeFrequency: 399.682944878731,
            nbPoints: 1024,
            firstX: 13.42727,
            lastX: 1.3052585346869103,
            total: 8546795.054609755
        }
    );

    checkJcamp('/data/indometacin/hmbc.dx', "HMBC Indometacin",
        {
            nbSpectra: 1024,
            xType: "1H",
            observeFrequency: 399.682956295637,
            nbPoints: 1024,
            firstX: 13.35119,
            lastX: 1.4369847858490203,
            total: 24130609.545490365
        }
    );

});