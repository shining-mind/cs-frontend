import takeBits from './take-bits';

describe('bits-us', () => {
  describe('takeBits', () => {
    test('take bits for a byte', () => {
      expect(takeBits(0b11111111, 0, 8)).toEqual(0b0);
      expect(takeBits(0b10000000, 1, 8)).toEqual(0b1);
      expect(takeBits(0b11000000, 2, 8)).toEqual(0b11);
      expect(takeBits(0b11100000, 3, 8)).toEqual(0b111);
      expect(takeBits(0b11110000, 4, 8)).toEqual(0b1111);
      expect(takeBits(0b11111000, 5, 8)).toEqual(0b11111);
      expect(takeBits(0b11111100, 6, 8)).toEqual(0b111111);
      expect(takeBits(0b11111110, 7, 8)).toEqual(0b1111111);
      expect(takeBits(0b11111111, 8, 8)).toEqual(0b11111111);
    });
  });
});
