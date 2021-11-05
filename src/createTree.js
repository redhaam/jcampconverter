import { ensureString } from 'ensure-string';

/**
 *
 * @typedef {object} CreateTreeOptions
 * @property {boolean} [flatten=false]
 */

/**
 *
 * @typedef {object} Tree
 * @property {string} title
 * @property {string} jcamp
 * @property {Tree[]} [children]
 */

/**
 * Parse the jcamp to extract the structure as a tree.
 *
 * @param {string|ArrayBuffer|Uint8Array} jcamp
 * @param {CreateTreeOptions} [options={}]
 * @returns {Tree[]}
 */
export function createTree(jcamp, options = {}) {
  jcamp = ensureString(jcamp);
  const { flatten = false } = options;
  if (typeof jcamp !== 'string') {
    throw new TypeError('the JCAMP should be a string');
  }

  let lines = jcamp.split(/[\r\n]+/);
  let flat = [];
  let stack = [];
  let result = [];
  let current;
  let ntupleLevel = 0;

  let spaces = jcamp.includes('## ');

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let labelLine = spaces ? line.replace(/ /g, '') : line;

    if (labelLine.substring(0, 9) === '##NTUPLES') {
      ntupleLevel++;
    }

    if (labelLine.substring(0, 7) === '##TITLE') {
      let title = [labelLine.substring(8).trim()];
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].startsWith('##')) {
          break;
        } else {
          title.push(lines[j].trim());
        }
      }
      stack.push({
        title: title.join('\n'),
        jcamp: `${line}\n`,
        children: [],
      });
      current = stack[stack.length - 1];
      flat.push(current);
    } else if (labelLine.substring(0, 5) === '##END' && ntupleLevel === 0) {
      current.jcamp += `${line}\n`;
      let finished = stack.pop();
      if (stack.length !== 0) {
        current = stack[stack.length - 1];
        current.children.push(finished);
      } else {
        current = undefined;
        result.push(finished);
      }
    } else if (current && current.jcamp) {
      current.jcamp += `${line}\n`;
      let match = labelLine.match(/^##(.*?)=(.+)/);
      if (match) {
        let canonicDataLabel = match[1].replace(/[ _-]/g, '').toUpperCase();
        if (canonicDataLabel === 'DATATYPE') {
          current.dataType = match[2].trim();
        }
      }
    }

    if (labelLine.substring(0, 5) === '##END' && ntupleLevel > 0) {
      ntupleLevel--;
    }
  }
  if (flatten) {
    flat.forEach((entry) => {
      entry.children = undefined;
    });
    return flat;
  } else {
    return result;
  }
}
