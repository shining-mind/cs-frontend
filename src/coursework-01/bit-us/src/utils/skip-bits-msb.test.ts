import skipBitsMSB from './skip-bits-msb';

describe('bit-us', () => {
  describe('skipBitsMSB', () => {
    test('skip bits from random size input', () => {
      expect(skipBitsMSB(0b101111, 2, 8)).toEqual(0b101111);
      expect(skipBitsMSB(0b101111, 2, 6)).toEqual(0b1111);
      expect(skipBitsMSB(0b1011111111, 3, 10)).toEqual(0b1111111);
      expect(skipBitsMSB(0b101, 2, 3)).toEqual(0b1);
    });

    test('skip bits from byte', () => {
      expect(skipBitsMSB(0b11111111, 0, 8)).toEqual(0b11111111);
      expect(skipBitsMSB(0b11111100, 1, 8)).toEqual(0b1111100);
      expect(skipBitsMSB(0b11111000, 2, 8)).toEqual(0b111000);
      expect(skipBitsMSB(0b11111000, 3, 8)).toEqual(0b11000);
      expect(skipBitsMSB(0b11111000, 4, 8)).toEqual(0b1000);
      expect(skipBitsMSB(0b11111101, 5, 8)).toEqual(0b101);
      expect(skipBitsMSB(0b11111110, 6, 8)).toEqual(0b10);
      expect(skipBitsMSB(0b11111111, 7, 8)).toEqual(0b1);
      expect(skipBitsMSB(0b11111111, 8, 8)).toEqual(0b0);
    });

    test('skip bits from 32bit word', () => {
      expect(skipBitsMSB(0xffffffff, 0, 32)).toEqual(0xffffffff);
      expect(skipBitsMSB(0x80000000, 1, 32)).toEqual(0b0);
      expect(skipBitsMSB(0xC0000000, 1, 32)).toEqual(0x40000000);
      expect(skipBitsMSB(0xE0000000, 2, 32)).toEqual(0x20000000);
      expect(skipBitsMSB(0xF0000000, 2, 32)).toEqual(0x30000000);
      expect(skipBitsMSB(0xF0000000, 4, 32)).toEqual(0b0);
      expect(skipBitsMSB(0xFFFFFFFF, 32, 32)).toEqual(0b0);
    });

    test('skip bits from 53bit word', () => {
      expect(skipBitsMSB(Number.MAX_SAFE_INTEGER, 21, 53)).toEqual(2 ** 32 - 1);
    });

    test('should throw if size arg is less than the bit count of the number', () => {
      expect(() => skipBitsMSB(0b101111, 3, 3)).toThrow(TypeError);
    });
  });
});
