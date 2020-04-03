export default function profiling(result, action, options) {
  if (result.profiling) {
    result.profiling.push({
      action,
      time: Date.now() - options.start,
    });
  }
}
