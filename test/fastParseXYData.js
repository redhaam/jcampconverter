'use strict';

var fastParseXYData = require('../src/fastParseXYData.js');


describe.skip('Test fastParseXYData', function () {

    var spectrum={};
    var info={
        logs:[]
    };
    var test="##XYDATA=(X++(Y..Y))\r\n16383a0247J1448o397J2441j3022J0792j3598N483k615J1645j1011J6370j7909\r\n16371f620R292j321N038j0945M298L923K026p846Q97O34Tp27j498N03J238J85j324";

    var result=fastParseXYData(spectrum, test, info);
    console.log(result);
});