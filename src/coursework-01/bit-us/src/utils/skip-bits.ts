/**
 * @param int
 * @param skip Skip N bits
 * @param size Size of the mask
 * @returns Bit mask
 */
export default function skipBits(int: number, skip: number, size: number = 8) {
  if (skip > size) {
    throw new TypeError('Skip offset should be less than mask size');
  }
  if (size - skip > 53) {
    throw new TypeError('Skip result is greater than 53 bits');
  }
  if (int > 2 ** size - 1) {
    throw new TypeError(`Input number "${int}" bit count is greater than size "${size}"`);
  }
  if (size > 31) {
    return Number(BigInt(int) & (2n ** BigInt(size - skip) - 1n));
  }
  return int & (2 ** (size - skip) - 1);
}
