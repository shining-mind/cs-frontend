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
  return int & (2 ** (size - skip) - 1);
}
