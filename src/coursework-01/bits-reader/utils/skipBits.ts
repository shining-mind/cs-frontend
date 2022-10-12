/**
 * @param int
 * @param skip Skip N bits starting from LSB
 * @param size Size of the mask
 * @returns Bit mask
 */
export default function skipBits(int: number, skip: number, size: number = 8) {
  if (skip > size) {
    throw new TypeError('Skip offset should be less than mask size');
  }
  return (int & (2 ** size - 2 ** skip)) >> skip;
}
