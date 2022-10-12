import takeBits from './takeBits';

describe('bits-reader', () => {
  describe('takeBits', () => {
    test('take bits for a byte', () => {
      expect(takeBits(0b11111111, 0, 8)).toEqual(0b0);
      expect(takeBits(0b11111111, 1, 8)).toEqual(0b1);
      expect(takeBits(0b11111111, 2, 8)).toEqual(0b11);
      expect(takeBits(0b11111111, 3, 8)).toEqual(0b111);
      expect(takeBits(0b11111111, 4, 8)).toEqual(0b1111);
      expect(takeBits(0b11111111, 5, 8)).toEqual(0b11111);
      expect(takeBits(0b11111111, 6, 8)).toEqual(0b111111);
      expect(takeBits(0b11111111, 7, 8)).toEqual(0b1111111);
      expect(takeBits(0b11111111, 8, 8)).toEqual(0b11111111);
    });
  });
});