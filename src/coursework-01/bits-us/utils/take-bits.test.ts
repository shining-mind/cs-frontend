import takeBits from './take-bits';

describe('bits-us', () => {
  describe('takeBits', () => {
    test('take bits from random size input', () => {
      expect(takeBits(0b101111, 2, 8)).toEqual(0b0);
      expect(takeBits(0b101111, 3, 6)).toEqual(0b101);
      expect(takeBits(0b1011111111, 3, 10)).toEqual(0b101);
      expect(takeBits(0b101, 2, 3)).toEqual(0b10);
    });

    test('take bits from a byte', () => {
      expect(takeBits(0b11111111, 0, 8)).toEqual(0b0);
      expect(takeBits(0b10000000, 1, 8)).toEqual(0b1);
      expect(takeBits(0b11000000, 2, 8)).toEqual(0b11);
      expect(takeBits(0b11100000, 3, 8)).toEqual(0b111);
      expect(takeBits(0b11110000, 4, 8)).toEqual(0b1111);
      expect(takeBits(0b11111000, 5, 8)).toEqual(0b11111);
      expect(takeBits(0b11111100, 6, 8)).toEqual(0b111111);
      expect(takeBits(0b11111110, 7, 8)).toEqual(0b1111111);
      expect(takeBits(0b11111111, 8, 8)).toEqual(0b11111111);
      expect(takeBits(0b00000001, 8, 8)).toEqual(0b1);
      expect(takeBits(0b00101011, 4, 8)).toEqual(0b10);
    });

    test('take bits from a 32bit word', () => {
      expect(takeBits(0xffffffff, 0, 32)).toEqual(0b0);
      expect(takeBits(0x80000000, 1, 32)).toEqual(0b1);
      expect(takeBits(0xC0000000, 2, 32)).toEqual(0b11);
      expect(takeBits(0xE0000000, 3, 32)).toEqual(0b111);
      expect(takeBits(0xF0000000, 4, 32)).toEqual(0b1111);
      expect(takeBits(0xFFFFFFFF, 32, 32)).toEqual(2 ** 32 - 1);
    });

    test('should throw if size arg is less than the bit count of the number', () => {
      expect(() => takeBits(0b101111, 3, 3)).toThrow(TypeError);
    });
  });
});
