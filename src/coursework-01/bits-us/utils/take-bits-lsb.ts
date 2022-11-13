/**
 * @param int
 * @param take Take N bits starting from LSB
 * @returns Bit mask
 */
export default function takeBitsLSB(int: number, take: number): number {
  if (take > 53) {
    throw new TypeError("Can't take more than 53 bits");
  }
  if (int > 2 ** 31 - 1) {
    return Number(BigInt(int) & BigInt(2 ** take - 1));
  }
  return int & (2 ** take - 1);
}
