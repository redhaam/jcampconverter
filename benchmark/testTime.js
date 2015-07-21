'use strict';

var Converter = require('..');
var fs = require('fs');

function checkJcamp(filename, label, data) {

    var result = Converter.convert(fs.readFileSync(__dirname + "/../test" + filename).toString());


//    console.log(result.profiling);

};



var options = {
    nbSpectra: 1,
    xType: "1H",
    observeFrequency: 400.1321303162,
    nbPoints: 16384,
    firstX: 12.31284,
    lastX: -1.6646457842364946,
    total: 11044828778.007011
};

var start=new Date();
checkJcamp('/data/compression/jcamp-fix.dx', "Compression fixed", options);
console.log("Compression fixed: ",new Date()-start, " ms");

var start=new Date();
checkJcamp('/data/compression/jcamp-packed.dx', "Compression packed", options);
console.log("Compression packed: ",new Date()-start, " ms");

var start=new Date();
checkJcamp('/data/compression/jcamp-squeezed.dx', "Compression squeezed", options);
console.log("Compression squeezed: ",new Date()-start, " ms");

var start=new Date();
checkJcamp('/data/compression/jcamp-difdup.dx', "Compression difdup", options);
console.log("Compression diffdup: ",new Date()-start, " ms");


