var Benchmark = require('benchmark');

var suite = new Benchmark.Suite();

suite
  .add('if', function () {
    var counter = 0;
    for (var k = 0; k < 1000; k++) {
      for (var i = 40; i < 60; i++) {
        if (i > 45 && i < 55) {
          counter++;
        } else if (i === 58) {
          counter--;
        } else if (i === 42) {
          counter += 2;
        }
      }
    }
  })
  .add('case', function () {
    var counter = 0;
    for (var k = 0; k < 1000; k++) {
      for (var i = 40; i < 60; i++) {
        switch (i) {
          case 46:
          case 47:
          case 48:
          case 49:
          case 50:
          case 51:
          case 52:
          case 53:
          case 54:
            counter++;
            break;
          case 58:
            counter--;
            break;
          case 42:
            counter += 2;
            break;
        }
      }
    }
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .run();
