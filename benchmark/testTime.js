import fs from 'fs';

import { convert } from '../src/index.js';

function checkJcamp(filename, label, options) {
  let result = convert(
    fs.readFileSync(`${__dirname}/../__tests__${filename}`).toString(),
    { noContour: true },
  );
}
console.time('time');
for (let i = 0; i < 20; i++) {
  checkJcamp('/data/indometacin/hmbc.dx', 'HMBC');
}

console.timeEnd('time');
