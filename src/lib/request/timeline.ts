export function getTimelinePercentage(
  values: number[],
  total: number
): string[] {
  return values.map((value) => {
    const pValue = Math.round((value / total) * 1000) / 1000;
    return /^0\.00[0-9]+/.test(pValue.toString())
      ? "<1%"
      : `${(pValue * 100).toFixed(1)}%`;
  });
}
