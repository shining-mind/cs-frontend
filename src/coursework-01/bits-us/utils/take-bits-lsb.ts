/**
 * @param int
 * @param take Take N bits starting from LSB
 * @param size Size of the mask
 * @returns Bit mask
 */
export default function takeBitsLSB(int: number, take: number, size: number = 8) {
  if (take > size) {
    throw new TypeError('Take offset should be less than mask size');
  }
  if (size > 32) {
    throw new TypeError("Can't read more than 32 bits");
  }
  return int & (2 ** take - 1);
}