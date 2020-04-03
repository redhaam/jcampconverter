export default function simpleChromatogram(result) {
  let data = result.spectra[0].data[0];
  result.chromatogram = {
    times: data.x.slice(),
    series: {
      intensity: {
        dimension: 1,
        data: data.y.slice(),
      },
    },
  };
}
