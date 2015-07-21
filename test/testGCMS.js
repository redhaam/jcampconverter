'use strict';

var Converter = require('..');
var fs = require('fs');



describe.only('Test JCAMP converter of GCMS', function () {

    var result = Converter.convert(fs.readFileSync(__dirname + '/data/misc/gcms.jdx').toString());
    var gcms=result.gcms;

    it('Check content', function () {
        gcms.should.keys(['gc','ms']);
        gcms.gc.should.be.type('object');
        gcms.ms.should.be.type('object');
        gcms.gc.tic.should.be.instanceof(Array);
    });

    it('Check length', function () {
        gcms.gc.tic.length.should.be.equal(4840);
        gcms.ms.length.should.be.equal(2420);
    });


    //console.log(Object.keys(gcms));

    //console.log(gcms.tic);

});