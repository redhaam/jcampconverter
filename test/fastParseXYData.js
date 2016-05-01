'use strict';

var Converter = require('..');
var fs = require('fs');


/*
checkJcamp('/data/compression/jcamp-fix.dx', "Compression fixed", options);
checkJcamp('/data/compression/jcamp-packed.dx', "Compression packed", options);
checkJcamp('/data/compression/jcamp-squeezed.dx', "Compression squeezed", options);
checkJcamp('/data/compression/jcamp-difdup.dx', "Compression difdup", options);
*/


describe.skip('Test fastParseXYData', function () {
    var options={
        fastParse:true
    }
    var result = Converter.convert(fs.readFileSync(__dirname + "/data/compression-small/jcamp-fix.dx").toString(),options);


    console.log(result.spectra[0].data);
});