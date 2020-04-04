import { readFileSync } from 'fs';
import { join } from 'path';
import convert from '../src/convert';

const file = join(__dirname, '../__tests__/data/cytisine/HMBC-ft.dx');

const jcamp = readFileSync(file, 'utf-8');

let result = convert(jcamp, {
  noContour: true,
  xy: true,
  keepRecordsRegExp: /.*/,
  profiling: true,
});
console.log(result.profiling);
