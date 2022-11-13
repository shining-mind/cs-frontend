import skipBits from './skip-bits';

describe('bits-us', () => {
  describe('skipBits', () => {
    test('skip bits from random size input', () => {
      expect(skipBits(0b101111, 2, 8)).toEqual(0b1011);
      expect(skipBits(0b101111, 2, 6)).toEqual(0b1011);
      expect(skipBits(0b1011111111, 3, 10)).toEqual(0b1011111);
      expect(skipBits(0b101, 2, 3)).toEqual(0b1);
    });

    test('skip bits for byte', () => {
      expect(skipBits(0b11111111, 0, 8)).toEqual(0b11111111);
      expect(skipBits(0b11111110, 1, 8)).toEqual(0b1111111);
      expect(skipBits(0b11111100, 2, 8)).toEqual(0b111111);
      expect(skipBits(0b11111000, 3, 8)).toEqual(0b11111);
      expect(skipBits(0b11110000, 4, 8)).toEqual(0b1111);
      expect(skipBits(0b11100000, 5, 8)).toEqual(0b111);
      expect(skipBits(0b11000000, 6, 8)).toEqual(0b11);
      expect(skipBits(0b10000000, 7, 8)).toEqual(0b1);
      expect(skipBits(0b11111111, 8, 8)).toEqual(0b0);
    });

    test('skip bits from 32bit word', () => {
      expect(skipBits(0xffffffff, 0, 32)).toEqual(0xffffffff);
      expect(skipBits(0x80000000, 1, 32)).toEqual(0x40000000);
      expect(skipBits(0xC0000000, 1, 32)).toEqual(0x60000000);
      expect(skipBits(0xE0000000, 2, 32)).toEqual(0x38000000);
      expect(skipBits(0xF0000000, 2, 32)).toEqual(0x3c000000);
      expect(skipBits(0xF0000000, 4, 32)).toEqual(0xf000000);
      expect(skipBits(0xFFFFFFFF, 32, 32)).toEqual(0b0);
    });

    test('skip bits from 53bit word', () => {
      expect(skipBits(Number.MAX_SAFE_INTEGER, 21, 53)).toEqual(2 ** 32 - 1);
    });

    test('should throw if size arg is less than the bit count of the number', () => {
      expect(() => skipBits(0b101111, 3, 3)).toThrow(TypeError);
    });
  });
});
