import skipBitsLSB from './skip-bits-lsb';

describe('bits-reader', () => {
  describe('skipBitsLSB', () => {
    test('skip bits for byte', () => {
      expect(skipBitsLSB(0b11111111, 0, 8)).toEqual(0b11111111);
      expect(skipBitsLSB(0b11111110, 1, 8)).toEqual(0b1111111);
      expect(skipBitsLSB(0b11111100, 2, 8)).toEqual(0b111111);
      expect(skipBitsLSB(0b11111000, 3, 8)).toEqual(0b11111);
      expect(skipBitsLSB(0b11110000, 4, 8)).toEqual(0b1111);
      expect(skipBitsLSB(0b11100000, 5, 8)).toEqual(0b111);
      expect(skipBitsLSB(0b11000000, 6, 8)).toEqual(0b11);
      expect(skipBitsLSB(0b10000000, 7, 8)).toEqual(0b1);
      expect(skipBitsLSB(0b11111111, 8, 8)).toEqual(0b0);
    });
  });
});
