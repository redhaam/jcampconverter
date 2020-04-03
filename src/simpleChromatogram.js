export default function simpleChromatogram(result) {
  let data = result.spectra[0].data;
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
