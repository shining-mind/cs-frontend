type Range = [number, number];

enum UnicodeNumeralRange {
  ASCII,
  DEVANAGARI,
  BENGALI,
  GURMUKHI,
  THAI,
  ROMAN,
  BRAHMI,
}

// NOTE: this array must be sorted
const ranges: Range[] = [
  [0x30, 0x39],
  [0x966, 0x96F],
  [0x9E6, 0x9EF],
  [0xA66, 0xA6F],
  [0xE50, 0xE59],
  [0x2160, 0x216F],
  [0x11066, 0x1106F],
];

function detectUnicodeNumeralRange(
  codePoint: number,
  arr: Range[] = ranges,
): UnicodeNumeralRange | null {
  const m = Math.floor(arr.length / 2);
  const [min, max] = arr[m];
  if (codePoint >= min && codePoint <= max) {
    return m;
  }
  if (arr.length <= 1) {
    return null;
  }
  const searchInLeftPart = arr[m][1] > codePoint;
  const result = detectUnicodeNumeralRange(
    codePoint,
    searchInLeftPart ? arr.slice(0, m) : arr.slice(m),
  );
  return result !== null ? result + (searchInLeftPart ? 0 : m) : result;
}

export default function isNumber(str: string) {
  const firstChar = str.codePointAt(0);
  if (firstChar === undefined) {
    return false;
  }
  const numeralRange = detectUnicodeNumeralRange(firstChar);
  if (numeralRange === null) {
    return false;
  }
  const [min, max] = ranges[numeralRange];
  for (const char of str) {
    const codePoint = char.codePointAt(0);
    if (codePoint === undefined || codePoint < min || codePoint > max) {
      return false;
    }
  }
  return true;
}
