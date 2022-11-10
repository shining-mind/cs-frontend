import skipBits from './skip-bits';

describe('bits-us', () => {
  describe('skipBits', () => {
    test('skip bits for byte', () => {
      expect(skipBits(0b11111111, 0, 8)).toEqual(0b11111111);
      expect(skipBits(0b11111100, 1, 8)).toEqual(0b1111100);
      expect(skipBits(0b11111000, 2, 8)).toEqual(0b111000);
      expect(skipBits(0b11111000, 3, 8)).toEqual(0b11000);
      expect(skipBits(0b11111000, 4, 8)).toEqual(0b1000);
      expect(skipBits(0b11111101, 5, 8)).toEqual(0b101);
      expect(skipBits(0b11111110, 6, 8)).toEqual(0b10);
      expect(skipBits(0b11111111, 7, 8)).toEqual(0b1);
      expect(skipBits(0b11111111, 8, 8)).toEqual(0b0);
    });
  });
});
