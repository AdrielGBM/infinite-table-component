import { getColor } from "./colors";

export type Percentile = 50 | 75 | 90 | 95 | 99;

export function calculateSpecificPercentile(
  values: number[],
  percentile: Percentile
) {
  // Step 1: Sort the values in ascending order
  const sortedValues = values.slice().sort((a, b) => a - b);
  const n = sortedValues.length;

  // Step 2: Calculate the index for the given percentile
  const index = (percentile / 100) * (n - 1);

  // Step 3: Handle non-integer index (interpolate between values)
  if (Number.isInteger(index)) {
    return sortedValues[index];
  } else {
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);
    const weight = index - lowerIndex;

    // Interpolate between the two nearest values
    return (
      sortedValues[lowerIndex] * (1 - weight) +
      sortedValues[upperIndex] * weight
    );
  }
}

export function calculatePercentile(values: number[], value: number) {
  // Step 1: Sort the values in ascending order
  const sortedValues = values.slice().sort((a, b) => a - b);
  const n = sortedValues.length;

  // Step 2: Find how many values are less than or equal to the given value
  const rank = sortedValues.filter((val) => val <= value).length;

  // Step 3: Calculate the percentile using the formula
  const percentile = (rank / n) * 100;

  return percentile;
}

export function getPercentileColor(value: number) {
  if (value < 50) {
    return getColor("green");
  } else if (value < 75) {
    return getColor("yellow");
  } else if (value < 90) {
    return getColor("orange");
  } else {
    return getColor("red");
  }
}
