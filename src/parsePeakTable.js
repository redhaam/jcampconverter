var removeCommentRegExp = /\$\$.*/;
var peakTableSplitRegExp = /[,\t ]+/;

module.exports=function(spectrum, value, result) {
    spectrum.isPeaktable=true;
    var i, ii, j, jj, values;
    var currentData = [];
    spectrum.data = [currentData];

    // counts for around 20% of the time
    var lines = value.split(/,? *,?[;\r\n]+ */);

    var k = 0;
    for (i = 1, ii = lines.length; i < ii; i++) {
        values = lines[i].trim().replace(removeCommentRegExp, '').split(peakTableSplitRegExp);
        if (values.length % 2 === 0) {
            for (j = 0, jj = values.length; j < jj; j = j + 2) {
                // takes around 40% of the time to add and parse the 2 values nearly exclusively because of parseFloat
                currentData[k++] = (parseFloat(values[j]) * spectrum.xFactor);
                currentData[k++] = (parseFloat(values[j + 1]) * spectrum.yFactor);
            }
        } else {
            result.logs.push('Format error: ' + values);
        }
    }
};
