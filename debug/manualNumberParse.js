var values=[
    "1",
    "1234",
    "-1234",
    "123456789",
    "1.1",
    "123456789.1",
    "123456789.123456789"
    ];

for (var value of values) {
    console.log("-------------- ",value," ---------------");
    var start=new Date().getTime();
    var counter=0;
    for (var i=0; i<10000000; i++) {
        counter+=manualParse(value);
    }
    console.log("manual convert          ",counter,new Date().getTime()-start);

    var start=new Date().getTime();
    var counter=0;
    for (var i=0; i<10000000; i++) {
        counter+=parseFloat(value);
    }
    console.log("convert by parse float  ",counter,new Date().getTime()-start);

    var start=new Date().getTime();
    var counter=0;
    for (var i=0; i<10000000; i++) {
        counter+=value*1;
    }
    console.log("Convert by multiply     ",counter,new Date().getTime()-start);

    var start=new Date().getTime();
    var counter=0;
    for (var i=0; i<10000000; i++) {
        counter+=value>>0;
    }
    console.log("Convert by bit shift 0  ",counter,new Date().getTime()-start);
}


function manualParse(value) {
    var currentValue=0;
    var decimalPosition=0;
    var isNegative=false;
    for (var j=0; j<value.length; j++) {
        var ascii=value.charCodeAt(j);
        if  ((ascii>47) && (ascii<58)) {
            if (decimalPosition>0) {
                currentValue+=(ascii-48)/Math.pow(10,decimalPosition++);
            } else {
                currentValue*=10;
                currentValue+=ascii-48;
            }
        } else if (ascii===44 || ascii===46) {
            decimalPosition++;
        } else if (ascii===45) {
            isNegative=true;
        }
    }
    return isNegative ? -currentValue : currentValue;
}