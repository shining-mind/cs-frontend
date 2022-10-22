/**
 * This functions returns index of the found element or -1 if none found
 * @param value Search value
 * @param sortedArray Sorted array to search in
 */
export default function binarySearch(value: number, sortedArray: number[]): number {
  const m = Math.floor(sortedArray.length / 2);
  if (sortedArray[m] === value) {
    return m;
  }
  if (sortedArray.length <= 1) {
    return -1;
  }
  const searchInLeftPart = sortedArray[m] > value;
  const result = binarySearch(
    value,
    searchInLeftPart ? sortedArray.slice(0, m) : sortedArray.slice(m),
  );
  return result > -1 ? result + (searchInLeftPart ? 0 : m) : result;
}
