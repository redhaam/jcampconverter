import { fileURLToPath } from 'url';

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import convert from '../src/convert.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const file = join(__dirname, '../__tests__/data/cytisine/HMBC-ft.dx');

const jcamp = readFileSync(file, 'utf-8');

let result = convert(jcamp, {
  noContour: true,
  xy: true,
  keepRecordsRegExp: /.*/,
  profiling: true,
});
console.log(result.profiling);
