'use strict';

var Converter = require('..');
var fs = require('fs');

describe('Test from Mestrec Jcamp generator', function () {

    it('NMR 1H spectrum 256', function () {
        var result = Converter.convert(fs.readFileSync(__dirname + '/data/mestrec/jcamp-256.jdx').toString(),
            {xy: true}
        );
        var data = result.spectra[0].data[0];
        expect(data.x.length).toBe(256);
        expect(data.y.length).toBe(256);
    });

    it('NMR 1H spectrum 1024', function () {
        var result = Converter.convert(fs.readFileSync(__dirname + '/data/mestrec/jcamp-1024.jdx').toString(),
            {xy: true}
        );
        var data = result.spectra[0].data[0];
        expect(data.x.length).toBe(1024);
        expect(data.y.length).toBe(1024);
    });

    it('NMR 1H spectrum difdup', function () {
        var result = Converter.convert(fs.readFileSync(__dirname + '/data/mestrec/jcamp-difdup.jdx').toString(),
            {xy: true}
        );
        var data = result.spectra[0].data[0];
        expect(data.x.length).toBe(16384);
        expect(data.y.length).toBe(16384);
        // console.log(data.x.length, Math.max(...data.x), Math.min(...data.x));
        // console.log(data.y.length, Math.max(...data.y), Math.min(...data.y));
    });

});
