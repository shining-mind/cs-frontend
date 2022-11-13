/**
 * @param int
 * @param take Take N bits
 * @param size Size of the bit mask - should be equal to bit count of int (8, 16, 32, etc.)
 * @returns Bits as number
 */
export default function takeBitsMSB(int: number, take: number, size: number = 8): number {
  if (take > size) {
    throw new TypeError('Take should be less than mask size');
  }
  if (size > 53) {
    throw new TypeError("Can't take more than 53 bits");
  }
  const bitMask = 2 ** size - 1;
  if (int > bitMask) {
    throw new TypeError(`Input number "${int}" bit count is greater than size "${size}"`);
  }
  if (size > 31) {
    const result = (BigInt(int) & BigInt(bitMask)) >> BigInt(size - take);
    return Number(result);
  }
  return (int & bitMask) >> (size - take);
}
