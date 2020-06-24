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
const ntuplesSeparator = /[ \t]*,[ \t]*/;

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
 * @param {text} jcamp
 * @param {object} [options]
 * @param {number} [options.keepRecordsRegExp=/^$/] By default we don't keep meta information
 * @param {number} [options.canonicDataLabels=true] Canonize the Labels (uppercase without symbol)
 * @param {number} [options.canonicMetadataLabels=false] Canonize the metadata Labels (uppercase without symbol)
 * @param {number} [options.dynamicTyping=false] Convert numbers to Number
 * @param {number} [options.withoutXY=false] Remove the XY data
 * @param {number} [options.chromatogram=false] Special post-processing for GC / HPLC / MS
 * @param {number} [options.keepSpectra=false] Force to keep the spectra in case of 2D
 * @param {number} [options.noContour=false] Don't calculate countour in case of 2D
 * @param {number} [options.nbContourLevels=7] Number of positive / negative contour levels to calculate
 * @param {number} [options.noiseMultiplier=5] Define for 2D the level as 5 times the median as default
 * @param {number} [options.profiling=false] Add profiling information
 */

export default function convert(jcamp, options = {}) {
  options = Object.assign({}, defaultOptions, options);
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
          if (!spectrum.deltaX) {
            spectrum.deltaX =
              (spectrum.lastX - spectrum.firstX) / (spectrum.nbPoints - 1);
          }
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
      };
      parentEntry.children.push(currentEntry);
      parentsStack.push(parentEntry);
      entriesFlat.push(currentEntry);
      currentEntry.title = dataValue;
    } else if (canonicDataLabel === 'DATATYPE') {
      currentEntry.dataType = dataValue;
      if (dataValue.toLowerCase().indexOf('nd') > -1) {
        currentEntry.twoD = true;
      }
    } else if (canonicDataLabel === 'NTUPLES') {
      if (dataValue.toLowerCase().indexOf('nd') > -1) {
        currentEntry.twoD = true;
      }
    } else if (canonicDataLabel === 'DATACLASS') {
      currentEntry.dataClass = dataValue;
    } else if (canonicDataLabel === 'XUNITS') {
      spectrum.xUnits = dataValue;
    } else if (canonicDataLabel === 'YUNITS') {
      spectrum.yUnits = dataValue;
    } else if (canonicDataLabel === 'FIRSTX') {
      spectrum.firstX = parseFloat(dataValue);
    } else if (canonicDataLabel === 'LASTX') {
      spectrum.lastX = parseFloat(dataValue);
    } else if (canonicDataLabel === 'FIRSTY') {
      spectrum.firstY = parseFloat(dataValue);
    } else if (canonicDataLabel === 'LASTY') {
      spectrum.lastY = parseFloat(dataValue);
    } else if (canonicDataLabel === 'NPOINTS') {
      spectrum.nbPoints = parseFloat(dataValue);
    } else if (canonicDataLabel === 'XFACTOR') {
      spectrum.xFactor = parseFloat(dataValue);
    } else if (canonicDataLabel === 'YFACTOR') {
      spectrum.yFactor = parseFloat(dataValue);
    } else if (canonicDataLabel === 'MAXX') {
      spectrum.maxX = parseFloat(dataValue);
    } else if (canonicDataLabel === 'MINX') {
      spectrum.minX = parseFloat(dataValue);
    } else if (canonicDataLabel === 'MAXY') {
      spectrum.maxY = parseFloat(dataValue);
    } else if (canonicDataLabel === 'MINY') {
      spectrum.minY = parseFloat(dataValue);
    } else if (canonicDataLabel === 'DELTAX') {
      spectrum.deltaX = parseFloat(dataValue);
    } else if (
      canonicDataLabel === '.OBSERVEFREQUENCY' ||
      canonicDataLabel === '$SFO1'
    ) {
      if (!spectrum.observeFrequency) {
        spectrum.observeFrequency = parseFloat(dataValue);
      }
    } else if (canonicDataLabel === '.OBSERVENUCLEUS') {
      if (!spectrum.xType) {
        currentEntry.xType = dataValue.replace(/[^a-zA-Z0-9]/g, '');
      }
    } else if (canonicDataLabel === '$OFFSET') {
      // OFFSET for Bruker spectra
      currentEntry.shiftOffsetNum = 0;
      if (!spectrum.shiftOffsetVal) {
        spectrum.shiftOffsetVal = parseFloat(dataValue);
      }
    } else if (canonicDataLabel === '$REFERENCEPOINT') {
      // OFFSET for Varian spectra
      // if we activate this part it does not work for ACD specmanager
      //         } else if (canonicDataLabel=='.SHIFTREFERENCE') {   // OFFSET FOR Bruker Spectra
      //                 var parts = dataValue.split(/ *, */);
      //                 currentEntry.shiftOffsetNum = parseInt(parts[2].trim());
      //                 spectrum.shiftOffsetVal = parseFloat(parts[3].trim());
    } else if (canonicDataLabel === 'VARNAME') {
      currentEntry.ntuples.varname = dataValue.split(ntuplesSeparator);
    } else if (canonicDataLabel === 'SYMBOL') {
      currentEntry.ntuples.symbol = dataValue.split(ntuplesSeparator);
    } else if (canonicDataLabel === 'VARTYPE') {
      currentEntry.ntuples.vartype = dataValue.split(ntuplesSeparator);
    } else if (canonicDataLabel === 'VARFORM') {
      currentEntry.ntuples.varform = dataValue.split(ntuplesSeparator);
    } else if (canonicDataLabel === 'VARDIM') {
      currentEntry.ntuples.vardim = convertToFloatArray(
        dataValue.split(ntuplesSeparator),
      );
    } else if (canonicDataLabel === 'UNITS') {
      currentEntry.ntuples.units = dataValue.split(ntuplesSeparator);
    } else if (canonicDataLabel === 'FACTOR') {
      currentEntry.ntuples.factor = convertToFloatArray(
        dataValue.split(ntuplesSeparator),
      );
    } else if (canonicDataLabel === 'FIRST') {
      currentEntry.ntuples.first = convertToFloatArray(
        dataValue.split(ntuplesSeparator),
      );
    } else if (canonicDataLabel === 'LAST') {
      currentEntry.ntuples.last = convertToFloatArray(
        dataValue.split(ntuplesSeparator),
      );
    } else if (canonicDataLabel === 'MIN') {
      currentEntry.ntuples.min = convertToFloatArray(
        dataValue.split(ntuplesSeparator),
      );
    } else if (canonicDataLabel === 'MAX') {
      currentEntry.ntuples.max = convertToFloatArray(
        dataValue.split(ntuplesSeparator),
      );
    } else if (canonicDataLabel === '.NUCLEUS') {
      if (currentEntry.ntuples) {
        currentEntry.ntuples.nucleus = dataValue.split(ntuplesSeparator);
      }
      if (currentEntry.twoD) {
        currentEntry.yType = dataValue.split(ntuplesSeparator)[0];
      }
    } else if (canonicDataLabel === 'PAGE') {
      spectrum.page = dataValue.trim();
      spectrum.pageValue = parseFloat(dataValue.replace(/^.*=/, ''));
      spectrum.pageSymbol = spectrum.page.replace(/[=].*/, '');
    } else if (canonicDataLabel === 'RETENTIONTIME') {
      spectrum.pageValue = parseFloat(dataValue);
    } else if (isMSField(canonicDataLabel)) {
      spectrum[convertMSFieldToLabel(canonicDataLabel)] = dataValue;
    } else if (canonicDataLabel === 'SAMPLEDESCRIPTION') {
      spectrum.sampleDescription = dataValue;
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
        let parsedValue = Number.parseFloat(value);
        if (!Number.isNaN(parsedValue)) value = parsedValue;
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
