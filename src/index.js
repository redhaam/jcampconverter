import add2D from './2d/add2D';
import {
  complexChromatogram,
  isMSField,
  convertMSFieldToLabel,
} from './complexChromatogram';
import convertToFloatArray from './convertToFloatArray';
import fastParseXYData from './parse/fastParseXYData';
import parsePeakTable from './parse/parsePeakTable';
import parseXYA from './parse/parseXYA';
import prepareSpectrum from './prepareSpectrum';
import simpleChromatogram from './simpleChromatogram';

function getConverter() {
  // the following RegExp can only be used for XYdata, some peakTables have values with a "E-5" ...
  const ntuplesSeparator = /[, \t]+/;

  class Spectrum {}

  const defaultOptions = {
    keepRecordsRegExp: /^$/,
    canonicDataLabels: true,
    dynamicTyping: false,
    xy: true,
    withoutXY: false,
    chromatogram: false,
    keepSpectra: false,
    noContour: false,
    nbContourLevels: 7,
    noiseMultiplier: 5,
    profiling: false,
  };

  function convert(jcamp, options) {
    options = Object.assign({}, defaultOptions, options);

    let wantXY = !options.withoutXY;

    let start = Date.now();

    let ntupleLevel = 0;

    let ntuples = {};
    let ldr, dataValue, ldrs;
    let position, endLine, infos;

    let result = {};
    result.profiling = options.profiling ? [] : false;
    result.logs = [];
    let spectra = [];
    result.spectra = spectra;
    result.info = {};
    let spectrum = new Spectrum();

    if (!(typeof jcamp === 'string')) {
      throw new TypeError('the JCAMP should be a string');
    }

    if (result.profiling) {
      result.profiling.push({
        action: 'Before split to LDRS',
        time: Date.now() - start,
      });
    }

    ldrs = jcamp.split(/[\r\n]+##/);

    if (result.profiling) {
      result.profiling.push({
        action: 'Split to LDRS',
        time: Date.now() - start,
      });
    }

    if (ldrs[0]) ldrs[0] = ldrs[0].replace(/^[\r\n ]*##/, '');

    for (let i = 0; i < ldrs.length; i++) {
      let dataLabel;
      ldr = ldrs[i];
      // This is a new LDR
      position = ldr.indexOf('=');
      if (position > 0) {
        dataLabel = ldr.substring(0, position);
        dataValue = ldr.substring(position + 1).trim();
      } else {
        dataLabel = ldr;
        dataValue = '';
      }
      let canonicDataLabel = dataLabel.replace(/[_ -]/g, '').toUpperCase();

      if (canonicDataLabel === 'DATATABLE') {
        endLine = dataValue.indexOf('\n');
        if (endLine === -1) endLine = dataValue.indexOf('\r');
        if (endLine > 0) {
          let xIndex = -1;
          let yIndex = -1;
          // ##DATA TABLE= (X++(I..I)), XYDATA
          // We need to find the variables

          infos = dataValue.substring(0, endLine).split(/[ ,;\t]+/);
          if (infos[0].indexOf('++') > 0) {
            let firstVariable = infos[0].replace(
              /.*\(([a-zA-Z0-9]+)\+\+.*/,
              '$1',
            );
            let secondVariable = infos[0].replace(
              /.*\.\.([a-zA-Z0-9]+).*/,
              '$1',
            );
            xIndex = ntuples.symbol.indexOf(firstVariable);
            yIndex = ntuples.symbol.indexOf(secondVariable);
          }

          if (xIndex === -1) xIndex = 0;
          if (yIndex === -1) yIndex = 0;

          if (ntuples.first) {
            if (ntuples.first.length > xIndex) {
              spectrum.firstX = ntuples.first[xIndex];
            }
            if (ntuples.first.length > yIndex) {
              spectrum.firstY = ntuples.first[yIndex];
            }
          }
          if (ntuples.last) {
            if (ntuples.last.length > xIndex) {
              spectrum.lastX = ntuples.last[xIndex];
            }
            if (ntuples.last.length > yIndex) {
              spectrum.lastY = ntuples.last[yIndex];
            }
          }
          if (ntuples.vardim && ntuples.vardim.length > xIndex) {
            spectrum.nbPoints = ntuples.vardim[xIndex];
          }
          if (ntuples.factor) {
            if (ntuples.factor.length > xIndex) {
              spectrum.xFactor = ntuples.factor[xIndex];
            }
            if (ntuples.factor.length > yIndex) {
              spectrum.yFactor = ntuples.factor[yIndex];
            }
          }
          if (ntuples.units) {
            if (ntuples.units.length > xIndex) {
              spectrum.xUnit = ntuples.units[xIndex];
            }
            if (ntuples.units.length > yIndex) {
              spectrum.yUnit = ntuples.units[yIndex];
            }
          }
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
        if (wantXY) {
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
          spectra.push(spectrum);
          spectrum = new Spectrum();
        }
        continue;
      } else if (canonicDataLabel === 'PEAKTABLE') {
        if (wantXY) {
          prepareSpectrum(spectrum);
          parsePeakTable(spectrum, dataValue, result);
          spectra.push(spectrum);
          spectrum = new Spectrum();
        }
        continue;
      }
      if (canonicDataLabel === 'PEAKASSIGNMENTS') {
        if (wantXY) {
          if (dataValue.match(/.*(XYA).*/)) {
            // ex: (XYA)
            parseXYA(spectrum, dataValue);
          }
          spectra.push(spectrum);
          spectrum = new Spectrum();
        }
        continue;
      }

      if (canonicDataLabel === 'TITLE') {
        spectrum.title = dataValue;
      } else if (canonicDataLabel === 'DATATYPE') {
        spectrum.dataType = dataValue;
        if (dataValue.indexOf('nD') > -1) {
          result.twoD = true;
        }
      } else if (canonicDataLabel === 'NTUPLES') {
        ntupleLevel++;
        if (dataValue.indexOf('nD') > -1) {
          result.twoD = true;
        }
      } else if (canonicDataLabel === 'XUNITS') {
        spectrum.xUnit = dataValue;
      } else if (canonicDataLabel === 'YUNITS') {
        spectrum.yUnit = dataValue;
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
          result.xType = dataValue.replace(/[^a-zA-Z0-9]/g, '');
        }
      } else if (canonicDataLabel === '$SFO2') {
        if (!result.indirectFrequency) {
          result.indirectFrequency = parseFloat(dataValue);
        }
      } else if (canonicDataLabel === '$OFFSET') {
        // OFFSET for Bruker spectra
        result.shiftOffsetNum = 0;
        if (!spectrum.shiftOffsetVal) {
          spectrum.shiftOffsetVal = parseFloat(dataValue);
        }
      } else if (canonicDataLabel === '$REFERENCEPOINT') {
        // OFFSET for Varian spectra
        // if we activate this part it does not work for ACD specmanager
        //         } else if (canonicDataLabel=='.SHIFTREFERENCE') {   // OFFSET FOR Bruker Spectra
        //                 var parts = dataValue.split(/ *, */);
        //                 result.shiftOffsetNum = parseInt(parts[2].trim());
        //                 spectrum.shiftOffsetVal = parseFloat(parts[3].trim());
      } else if (canonicDataLabel === 'VARNAME') {
        ntuples.varname = dataValue.split(ntuplesSeparator);
      } else if (canonicDataLabel === 'SYMBOL') {
        ntuples.symbol = dataValue.split(ntuplesSeparator);
      } else if (canonicDataLabel === 'VARTYPE') {
        ntuples.vartype = dataValue.split(ntuplesSeparator);
      } else if (canonicDataLabel === 'VARFORM') {
        ntuples.varform = dataValue.split(ntuplesSeparator);
      } else if (canonicDataLabel === 'VARDIM') {
        ntuples.vardim = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (canonicDataLabel === 'UNITS') {
        ntuples.units = dataValue.split(ntuplesSeparator);
      } else if (canonicDataLabel === 'FACTOR') {
        ntuples.factor = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (canonicDataLabel === 'FIRST') {
        ntuples.first = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (canonicDataLabel === 'LAST') {
        ntuples.last = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (canonicDataLabel === 'MIN') {
        ntuples.min = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (canonicDataLabel === 'MAX') {
        ntuples.max = convertToFloatArray(dataValue.split(ntuplesSeparator));
      } else if (canonicDataLabel === '.NUCLEUS') {
        if (result.twoD) {
          result.yType = dataValue.split(ntuplesSeparator)[0];
        }
      } else if (canonicDataLabel === 'PAGE') {
        spectrum.page = dataValue.trim();
        spectrum.pageValue = parseFloat(dataValue.replace(/^.*=/, ''));
        spectrum.pageSymbol = spectrum.page.replace(/[=].*/, '');
        let pageSymbolIndex = ntuples.symbol.indexOf(spectrum.pageSymbol);
        let unit = '';
        if (ntuples.units && ntuples.units[pageSymbolIndex]) {
          unit = ntuples.units[pageSymbolIndex];
        }
        if (result.indirectFrequency && unit !== 'PPM') {
          spectrum.pageValue /= result.indirectFrequency;
        }
      } else if (canonicDataLabel === 'RETENTIONTIME') {
        spectrum.pageValue = parseFloat(dataValue);
      } else if (isMSField(canonicDataLabel)) {
        spectrum[convertMSFieldToLabel(canonicDataLabel)] = dataValue;
      } else if (canonicDataLabel === 'SAMPLEDESCRIPTION') {
        spectrum.sampleDescription = dataValue;
      } else if (canonicDataLabel === 'END') {
        // todo
      }

      if (canonicDataLabel === 'END' && ntupleLevel > 0) {
        ntupleLevel--;
      }

      if (canonicDataLabel.match(options.keepRecordsRegExp)) {
        let label = options.canonicDataLabels ? canonicDataLabel : dataLabel;
        let value = dataValue.trim();
        if (options.dynamicTyping && !isNaN(value)) {
          value = Number(value);
        }
        if (result.info[label]) {
          if (!Array.isArray(result.info[label])) {
            result.info[label] = [result.info[label]];
          }
          result.info[label].push(value);
        } else {
          result.info[label] = value;
        }
      }
    }

    if (result.profiling) {
      result.profiling.push({
        action: 'Finished parsing',
        time: Date.now() - start,
      });
    }

    if (Object.keys(ntuples).length > 0) {
      let newNtuples = [];
      let keys = Object.keys(ntuples);
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let values = ntuples[key];
        for (let j = 0; j < values.length; j++) {
          if (!newNtuples[j]) newNtuples[j] = {};
          newNtuples[j][key] = values[j];
        }
      }
      result.ntuples = newNtuples;
    }

    if (result.twoD && wantXY) {
      add2D(result, options);
      if (result.profiling) {
        result.profiling.push({
          action: 'Finished countour plot calculation',
          time: Date.now() - start,
        });
      }
      if (!options.keepSpectra) {
        delete result.spectra;
      }
    }

    if (options.chromatogram) {
      options.xy = true;
    }

    if (options.xy && wantXY) {
      // the spectraData should not be a oneD array but an object with x and y
      if (spectra.length > 0) {
        for (let i = 0; i < spectra.length; i++) {
          spectrum = spectra[i];
          if (spectrum.data && spectrum.data.length > 0) {
            for (let j = 0; j < spectrum.data.length; j++) {
              let data = spectrum.data[j];
              let newData = {
                x: new Array(data.length / 2),
                y: new Array(data.length / 2),
              };
              for (let k = 0; k < data.length; k = k + 2) {
                newData.x[k / 2] = data[k];
                newData.y[k / 2] = data[k + 1];
              }
              spectrum.data[j] = newData;
            }
          }
        }
      }
    }

    // maybe it is a GC (HPLC) / MS. In this case we add a new format
    if (options.chromatogram) {
      if (result.spectra.length > 1) {
        complexChromatogram(result);
      } else {
        simpleChromatogram(result);
      }
      if (result.profiling) {
        result.profiling.push({
          action: 'Finished chromatogram calculation',
          time: Date.now() - start,
        });
      }
    }

    if (result.profiling) {
      result.profiling.push({
        action: 'Total time',
        time: Date.now() - start,
      });
    }

    return result;
  }

  return convert;
}

export const convert = getConverter();

export { default as createTree } from './createTree';
