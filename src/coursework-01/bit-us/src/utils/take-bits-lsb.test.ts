import takeBitsLSB from './take-bits-lsb';

describe('bit-us', () => {
  describe('takeBitsLSB', () => {
    test('take bits from random size input', () => {
      expect(takeBitsLSB(0b101111, 2)).toEqual(0b11);
      expect(takeBitsLSB(0b101001, 4)).toEqual(0b1001);
      expect(takeBitsLSB(0b10111111101, 3)).toEqual(0b101);
      expect(takeBitsLSB(0b101, 2)).toEqual(0b1);
      expect(takeBitsLSB(0xffffff7a, 4)).toEqual(0b1010);
      expect(takeBitsLSB(0x1ff0ffefafeffa, 53))
        .toEqual(0b11111111100001111111111101111101011111110111111111010);
    });

    test('take bits for a byte', () => {
      expect(takeBitsLSB(0b11111111, 0)).toEqual(0b0);
      expect(takeBitsLSB(0b00000001, 1)).toEqual(0b1);
      expect(takeBitsLSB(0b00000011, 2)).toEqual(0b11);
      expect(takeBitsLSB(0b00000111, 3)).toEqual(0b111);
      expect(takeBitsLSB(0b00001111, 4)).toEqual(0b1111);
      expect(takeBitsLSB(0b00011111, 5)).toEqual(0b11111);
      expect(takeBitsLSB(0b00111111, 6)).toEqual(0b111111);
      expect(takeBitsLSB(0b01111111, 7)).toEqual(0b1111111);
      expect(takeBitsLSB(0b11111111, 8)).toEqual(0b11111111);
    });

    test('should throw when on take more than 53bits', () => {
      expect(() => takeBitsLSB(0x1ff0ffefafeffa, 54)).toThrowError(TypeError);
    });
  });
});
