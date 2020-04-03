var Benchmark = require('benchmark');

var suite = new Benchmark.Suite();

suite
  .add('4 push', function () {
    var array = [];
    for (var i = 0; i < 10000; i++) {
      array.push(i * 2);
      array.push(i * 3);
      array.push(i * 4);
      array.push(i * 5);
    }
  })
  .add('1 push', function () {
    var array = [];
    for (var i = 0; i < 10000; i++) {
      array.push(i * 2, i * 3, i * 4, i * 5);
    }
  })
  .add('counter', function () {
    var array = [];
    var counter = 0;
    for (var i = 0; i < 10000; i++) {
      array[counter++] = i * 2;
      array[counter++] = i * 3;
      array[counter++] = i * 4;
      array[counter++] = i * 5;
    }
  })
  .add('counter known array size', function () {
    var array = new Array(40000);
    var counter = 0;
    for (var i = 0; i < 10000; i++) {
      array[counter++] = i * 2;
      array[counter++] = i * 3;
      array[counter++] = i * 4;
      array[counter++] = i * 5;
    }
  })
  .add('counter known array size 80000', function () {
    var array = new Array(80000);
    var counter = 0;
    for (var i = 0; i < 10000; i++) {
      array[counter++] = i * 2;
      array[counter++] = i * 3;
      array[counter++] = i * 4;
      array[counter++] = i * 5;
    }
  })
  .add('counter very big array size', function () {
    var array = new Array(400000);
    var counter = 0;
    for (var i = 0; i < 10000; i++) {
      array[counter++] = i * 2;
      array[counter++] = i * 3;
      array[counter++] = i * 4;
      array[counter++] = i * 5;
    }
    array.length = 40000;
  })
  .add('counter too big array size', function () {
    var array = new Array(80000);
    var counter = 0;
    for (var i = 0; i < 10000; i++) {
      array[counter++] = i * 2;
      array[counter++] = i * 3;
      array[counter++] = i * 4;
      array[counter++] = i * 5;
    }
    array.length = 40000;
  })
  .add('counter too big array size + slice', function () {
    var array = new Array(80000);
    var counter = 0;
    for (var i = 0; i < 10000; i++) {
      array[counter++] = i * 2;
      array[counter++] = i * 3;
      array[counter++] = i * 4;
      array[counter++] = i * 5;
    }
    //   array=array.slice(0,counter);
  })
  .add('counter too small array size', function () {
    var array = new Array(10000);
    var counter = 0;
    for (var i = 0; i < 10000; i++) {
      array[counter++] = i * 2;
      array[counter++] = i * 3;
      array[counter++] = i * 4;
      array[counter++] = i * 5;
    }
    array.length = 40000;
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .run();
