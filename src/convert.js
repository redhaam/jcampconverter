import { parseString } from 'dynamic-typing';
import { ensureString } from 'ensure-string';

import { isMSField, convertMSFieldToLabel } from './complexChromatogram';
import convertToFloatArray from './convertToFloatArray';
import fastParseXYData from './parse/fastParseXYData';
import parsePeakTable from './parse/parsePeakTable';
import parseXYA from './parse/parseXYA';
import postProcessing from './postProcessing';
import prepareNtuplesDatatable from './prepareNtuplesDatatable';
import prepareSpectrum from './prepareSpectrum';
import profiling from './profiling';

// the following RegExp can only be used for XYdata, some peakTables have values with a "E-5" ...
const ntuplesSeparatorRegExp = /[ \t]*,[ \t]*/;

class Spectrum {}

const defaultOptions = {
  keepRecordsRegExp: /^$/,
  canonicDataLabels: true,
  canonicMetadataLabels: false,
  dynamicTyping: true,
  withoutXY: false,
  chromatogram: false,
  keepSpectra: false,
  noContour: false,
  nbContourLevels: 7,
  noiseMultiplier: 5,
  profiling: false,
};

/**
 *
 * @typedef {object} ConvertOptions
 * @property {number} [options.keepRecordsRegExp=/^$/] - By default we don't keep meta information.
 * @property {number} [options.canonicDataLabels=true] - Canonize the Labels (uppercase without symbol).
 * @property {number} [options.canonicMetadataLabels=false] - Canonize the metadata Labels (uppercase without symbol).
 * @property {number} [options.dynamicTyping=false] - Convert numbers to Number.
 * @property {number} [options.withoutXY=false] - Remove the XY data.
 * @property {number} [options.chromatogram=false] - Special post-processing for GC / HPLC / MS.
 * @property {number} [options.keepSpectra=false] - Force to keep the spectra in case of 2D.
 * @property {number} [options.noContour=false] - Don't calculate countour in case of 2D.
 * @property {number} [options.nbContourLevels=7] - Number of positive / negative contour levels to calculate.
 * @property {number} [options.noiseMultiplier=5] - Define for 2D the level as 5 times the median as default.
 * @property {number} [options.profiling=false] - Add profiling information.
 */

/**
 *
 * @typedef {object} Ntuples
 * @property {string[]} [varname]
 * @property {string[]} [symbol]
 * @property {string[]} [vartype]
 * @property {string[]} [varform]
 * @property {number[]} [vardim]
 * @property {string[]} [units]
 * @property {number[]} [factor]
 * @property {number[]} [first]
 * @property {number[]} [last]
 * @property {number[]} [min]
 * @property {number[]} [max]
 * @property {string[]} [nucleus]
 */

/**
 *
 * @typedef { object } Entry
 * @property {Spectrum[]} spectra
 * @property {Ntuples} ntuples
 * @property {object} meta
 * @property {object} tmp
 * @property {string} [title]
 * @property {string} [dataType]
 * @property {string} [dataClass]
 * @property {boolean} [twoD]
 */

/**
 *
 * @typedef { object } ConvertResult
 * @property { array | boolean } profiling
 * @property { array } logs
 * @property { object[] } entries
 * @property { Entry[] } flatten
 */

/**
 * Parse a jcamp.
 *
 * @param {string|ArrayBuffer|Uint8Array} jcamp
 * @param {ConvertOptions} [options]
 * @returns {ConvertResult}
 */

export function convert(jcamp, options = {}) {
  jcamp = ensureString(jcamp);
  options = { ...defaultOptions, ...options };
  options.wantXY = !options.withoutXY;
  options.start = Date.now();

  let entriesFlat = [];

  let result = {
    profiling: options.profiling ? [] : false,
    logs: [],
    entries: [],
  };

  let tmpResult = { children: [] };
  let currentEntry = tmpResult;
  let parentsStack = [];

  let spectrum = new Spectrum();

  if (typeof jcamp !== 'string') {
    throw new TypeError('the JCAMP should be a string');
  }

  profiling(result, 'Before split to LDRS', options);

  let ldrs = jcamp.replace(/[\r\n]+##/g, '\n##').split('\n##');

  profiling(result, 'Split to LDRS', options);

  if (ldrs[0]) ldrs[0] = ldrs[0].replace(/^[\r\n ]*##/, '');

  for (let ldr of ldrs) {
    // This is a new LDR
    let position = ldr.indexOf('=');
    let dataLabel = position > 0 ? ldr.substring(0, position) : ldr;
    let dataValue = position > 0 ? ldr.substring(position + 1).trim() : '';

    let canonicDataLabel = dataLabel.replace(/[_ -]/g, '').toUpperCase();

    if (canonicDataLabel === 'DATATABLE') {
      let endLine = dataValue.indexOf('\n');
      if (endLine === -1) endLine = dataValue.indexOf('\r');
      if (endLine > 0) {
        // ##DATA TABLE= (X++(I..I)), XYDATA
        // We need to find the variables

        let infos = dataValue.substring(0, endLine).split(/[ ,;\t]+/);
        prepareNtuplesDatatable(currentEntry, spectrum, infos[0]);

        spectrum.datatable = infos[0];
        if (infos[1] && infos[1].indexOf('PEAKS') > -1) {
          canonicDataLabel = 'PEAKTABLE';
        } else if (
          infos[1] &&
          (infos[1].indexOf('XYDATA') || infos[0].indexOf('++') > 0)
        ) {
          canonicDataLabel = 'XYDATA';
          spectrum.deltaX =
            (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
        }
      }
    }

    if (canonicDataLabel === 'XYDATA') {
      if (options.wantXY) {
        prepareSpectrum(spectrum);
        // well apparently we should still consider it is a PEAK TABLE if there are no '++' after
        if (dataValue.match(/.*\+\+.*/)) {
          // ex: (X++(Y..Y))
          spectrum.deltaX =
            (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);

          fastParseXYData(spectrum, dataValue, result);
        } else {
          parsePeakTable(spectrum, dataValue, result);
        }
        currentEntry.spectra.push(spectrum);
        spectrum = new Spectrum();
      }
      continue;
    } else if (canonicDataLabel === 'PEAKTABLE') {
      if (options.wantXY) {
        prepareSpectrum(spectrum);
        parsePeakTable(spectrum, dataValue, result);
        currentEntry.spectra.push(spectrum);
        spectrum = new Spectrum();
      }
      continue;
    }
    if (canonicDataLabel === 'PEAKASSIGNMENTS') {
      if (options.wantXY) {
        if (dataValue.match(/.*(XYA).*/)) {
          // ex: (XYA)
          parseXYA(spectrum, dataValue);
        }
        currentEntry.spectra.push(spectrum);
        spectrum = new Spectrum();
      }
      continue;
    }

    if (canonicDataLabel === 'TITLE') {
      let parentEntry = currentEntry;
      if (!parentEntry.children) {
        parentEntry.children = [];
      }
      currentEntry = {
        spectra: [],
        ntuples: {},
        info: {},
        meta: {},
        tmp: {}, // tmp information we need to keep for postprocessing
      };
      parentEntry.children.push(currentEntry);
      parentsStack.push(parentEntry);
      entriesFlat.push(currentEntry);
      currentEntry.title = dataValue;
    } else if (canonicDataLabel === 'DATATYPE') {
      currentEntry.dataType = dataValue;
      if (dataValue.match(/(^nd|\snd\s)/i)) {
        currentEntry.twoD = true;
      }
    } else if (canonicDataLabel === 'NTUPLES') {
      if (dataValue.match(/(^nd|\snd\s)/i)) {
        currentEntry.twoD = true;
      }
    } else if (canonicDataLabel === 'DATACLASS') {
      currentEntry.dataClass = dataValue;
    } else if (canonicDataLabel === 'XUNITS') {
      spectrum.xUnits = dataValue;
    } else if (canonicDataLabel === 'YUNITS') {
      spectrum.yUnits = dataValue;
    } else if (canonicDataLabel === 'FIRSTX') {
      spectrum.firstX = Number(dataValue);
    } else if (canonicDataLabel === 'LASTX') {
      spectrum.lastX = Number(dataValue);
    } else if (canonicDataLabel === 'FIRSTY') {
      spectrum.firstY = Number(dataValue);
    } else if (canonicDataLabel === 'LASTY') {
      spectrum.lastY = Number(dataValue);
    } else if (canonicDataLabel === 'NPOINTS') {
      spectrum.nbPoints = Number(dataValue);
    } else if (canonicDataLabel === 'XFACTOR') {
      spectrum.xFactor = Number(dataValue);
    } else if (canonicDataLabel === 'YFACTOR') {
      spectrum.yFactor = Number(dataValue);
    } else if (canonicDataLabel === 'MAXX') {
      spectrum.maxX = Number(dataValue);
    } else if (canonicDataLabel === 'MINX') {
      spectrum.minX = Number(dataValue);
    } else if (canonicDataLabel === 'MAXY') {
      spectrum.maxY = Number(dataValue);
    } else if (canonicDataLabel === 'MINY') {
      spectrum.minY = Number(dataValue);
    } else if (canonicDataLabel === 'DELTAX') {
      spectrum.deltaX = Number(dataValue);
    } else if (
      canonicDataLabel === '.OBSERVEFREQUENCY' ||
      canonicDataLabel === '$SFO1'
    ) {
      if (!spectrum.observeFrequency) {
        spectrum.observeFrequency = Number(dataValue);
      }
    } else if (canonicDataLabel === '.OBSERVENUCLEUS') {
      if (!spectrum.xType) {
        currentEntry.xType = dataValue.replace(/[^a-zA-Z0-9]/g, '');
      }
    } else if (canonicDataLabel === '$OFFSET') {
      // OFFSET for Bruker spectra
      currentEntry.shiftOffsetNum = 0;
      if (!spectrum.shiftOffsetVal) {
        spectrum.shiftOffsetVal = Number(dataValue);
      }
    } else if (canonicDataLabel === '$REFERENCEPOINT') {
      // OFFSET for Varian spectra
      // if we activate this part it does not work for ACD specmanager
      //         } else if (canonicDataLabel=='.SHIFTREFERENCE') {   // OFFSET FOR Bruker Spectra
      //                 var parts = dataValue.split(/ *, */);
      //                 currentEntry.shiftOffsetNum = parseInt(parts[2].trim());
      //                 spectrum.shiftOffsetVal = Number(parts[3].trim());
    } else if (canonicDataLabel === 'VARNAME') {
      currentEntry.ntuples.varname = dataValue.split(ntuplesSeparatorRegExp);
    } else if (canonicDataLabel === 'SYMBOL') {
      currentEntry.ntuples.symbol = dataValue.split(ntuplesSeparatorRegExp);
    } else if (canonicDataLabel === 'VARTYPE') {
      currentEntry.ntuples.vartype = dataValue.split(ntuplesSeparatorRegExp);
    } else if (canonicDataLabel === 'VARFORM') {
      currentEntry.ntuples.varform = dataValue.split(ntuplesSeparatorRegExp);
    } else if (canonicDataLabel === 'VARDIM') {
      currentEntry.ntuples.vardim = convertToFloatArray(
        dataValue.split(ntuplesSeparatorRegExp),
      );
    } else if (canonicDataLabel === 'UNITS') {
      currentEntry.ntuples.units = dataValue.split(ntuplesSeparatorRegExp);
    } else if (canonicDataLabel === 'FACTOR') {
      currentEntry.ntuples.factor = convertToFloatArray(
        dataValue.split(ntuplesSeparatorRegExp),
      );
    } else if (canonicDataLabel === 'FIRST') {
      currentEntry.ntuples.first = convertToFloatArray(
        dataValue.split(ntuplesSeparatorRegExp),
      );
    } else if (canonicDataLabel === 'LAST') {
      currentEntry.ntuples.last = convertToFloatArray(
        dataValue.split(ntuplesSeparatorRegExp),
      );
    } else if (canonicDataLabel === 'MIN') {
      currentEntry.ntuples.min = convertToFloatArray(
        dataValue.split(ntuplesSeparatorRegExp),
      );
    } else if (canonicDataLabel === 'MAX') {
      currentEntry.ntuples.max = convertToFloatArray(
        dataValue.split(ntuplesSeparatorRegExp),
      );
    } else if (canonicDataLabel === '.NUCLEUS') {
      if (currentEntry.ntuples) {
        currentEntry.ntuples.nucleus = dataValue.split(ntuplesSeparatorRegExp);
      }
    } else if (canonicDataLabel === 'PAGE') {
      spectrum.page = dataValue.trim();
      spectrum.pageValue = Number(dataValue.replace(/^.*=/, ''));
      spectrum.pageSymbol = spectrum.page.replace(/[=].*/, '');
    } else if (canonicDataLabel === 'RETENTIONTIME') {
      spectrum.pageValue = Number(dataValue);
    } else if (isMSField(canonicDataLabel)) {
      spectrum[convertMSFieldToLabel(canonicDataLabel)] = dataValue;
    } else if (canonicDataLabel === 'SAMPLEDESCRIPTION') {
      spectrum.sampleDescription = dataValue;
    } else if (canonicDataLabel.startsWith('$NUC')) {
      if (!currentEntry.tmp[canonicDataLabel] && !dataValue.includes('off')) {
        currentEntry.tmp[canonicDataLabel] = dataValue.replace(/[<>]/g, '');
      }
    } else if (canonicDataLabel === 'END') {
      currentEntry = parentsStack.pop();
    }

    if (
      currentEntry &&
      currentEntry.info &&
      currentEntry.meta &&
      canonicDataLabel.match(options.keepRecordsRegExp)
    ) {
      let value = dataValue.trim();
      let target, label;
      if (dataLabel.startsWith('$')) {
        label = options.canonicMetadataLabels
          ? canonicDataLabel.substring(1)
          : dataLabel.substring(1);
        target = currentEntry.meta;
      } else {
        label = options.canonicDataLabels ? canonicDataLabel : dataLabel;
        target = currentEntry.info;
      }

      if (options.dynamicTyping) {
        value = parseString(value);
      }
      if (target[label]) {
        if (!Array.isArray(target[label])) {
          target[label] = [target[label]];
        }
        target[label].push(value);
      } else {
        target[label] = value;
      }
    }
  }

  profiling(result, 'Finished parsing', options);

  postProcessing(entriesFlat, result, options);

  profiling(result, 'Total time', options);

  /*
  if (result.children && result.children.length>0) {
    result = { ...result, ...result.children[0] };
  }
  */
  result.entries = tmpResult.children;
  result.flatten = entriesFlat;

  return result;
}
