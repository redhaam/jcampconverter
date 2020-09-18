import { readFileSync } from 'fs';

import { convert } from '../src';

let jcamp = readFileSync(`${__dirname}/data/misc/uv.jdx`).toString();

test('uv.jdx', () => {
  let result = convert(jcamp);
  expect(result.flatten).toHaveLength(3);
});
