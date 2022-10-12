import UintBitsReader from './UintBitsReader';

describe('bits-reader', () => {
  describe('UintBitsReader', () => {
    test('read 14 bits numbers', () => {
      const buffer = new Uint8Array([0x8f, 0x01, 0x4b, 0x10]);
      const bitReader = new UintBitsReader(buffer);
      expect(bitReader.read(14)).toEqual(399);
      expect(bitReader.read(14)).toEqual(300);
    });

    test('read by 1 bit', () => {
      const buffer = new Uint8Array([0b10011001, 0b10100001]);
      const bitReader = new UintBitsReader(buffer);
      expect(bitReader.read(1)).toEqual(1);
      expect(bitReader.read(1)).toEqual(0);
      expect(bitReader.read(1)).toEqual(0);
      expect(bitReader.read(1)).toEqual(1);
      expect(bitReader.read(1)).toEqual(1);
      expect(bitReader.read(1)).toEqual(0);
      expect(bitReader.read(1)).toEqual(0);
      expect(bitReader.read(1)).toEqual(1);
      expect(bitReader.read(1)).toEqual(1);
      expect(bitReader.read(1)).toEqual(0);
      expect(bitReader.read(1)).toEqual(0);
      expect(bitReader.read(1)).toEqual(0);
      expect(bitReader.read(1)).toEqual(0);
      expect(bitReader.read(1)).toEqual(1);
      expect(bitReader.read(1)).toEqual(0);
      expect(bitReader.read(1)).toEqual(1);
    });

    test('skip and read (partial read)', () => {
      const buffer = new Uint8Array([0b10011001, 0b10100001]);
      const bitReader = new UintBitsReader(buffer);
      expect(bitReader.read(1)).toEqual(1);
      expect(bitReader.read(1)).toEqual(0);
      expect(bitReader.read(1)).toEqual(0);
      expect(bitReader.read(1)).toEqual(1);
      bitReader.seek(1);
      expect(bitReader.read(1)).toEqual(0);
      expect(bitReader.read(1)).toEqual(1);
      expect(bitReader.read(1)).toEqual(0);
      expect(bitReader.read(1)).toEqual(1);
      expect(() => bitReader.read(1)).toThrowError('Reached bitstream end');
    });

    test('skip with bit remainder reset and read', () => {
      const buffer = new Uint8Array([0b10011001, 0b10100001]);
      const bitReader = new UintBitsReader(buffer);
      expect(bitReader.read(1)).toEqual(1);
      expect(bitReader.read(1)).toEqual(0);
      expect(bitReader.read(1)).toEqual(0);
      expect(bitReader.read(1)).toEqual(1);
      bitReader.seek(1, true);
      expect(bitReader.read(1)).toEqual(1);
      expect(bitReader.read(1)).toEqual(0);
      expect(bitReader.read(1)).toEqual(0);
      expect(bitReader.read(1)).toEqual(0);
      expect(bitReader.read(1)).toEqual(0);
      expect(bitReader.read(1)).toEqual(1);
      expect(bitReader.read(1)).toEqual(0);
      expect(bitReader.read(1)).toEqual(1);
      expect(() => bitReader.read(1)).toThrowError('Reached bitstream end');
    });

    test('read uint32', () => {
      const buffer = new Uint8Array([0x98, 0x3f, 0x01, 0x00]);
      const bitReader = new UintBitsReader(buffer);
      expect(bitReader.read(32)).toEqual(81816);
    });

    test('rewind', () => {
      const buffer = new Uint8Array([0xff, 0xff]);
      const bitReader = new UintBitsReader(buffer);
      expect(bitReader.read(16)).toEqual(65535);
      bitReader.rewind();
      expect(bitReader.read(8)).toEqual(255);
    });

    test('iterate 3 bit numbers', () => {
      const buffer = new Uint8Array([0b11100111, 0b01111001, 0b10011110]);
      const bitReader = new UintBitsReader(buffer);
      const numbers = Array.from(bitReader.values(3));
      expect(numbers).toHaveLength(8);
      expect(numbers).toEqual([
        0b111,
        0b100,
        0b111,
        0b100,
        0b111,
        0b100,
        0b111,
        0b100,
      ]);
    });

    test('should throw if byte array can not be divided by given bits', () => {
      const buffer = new Uint8Array([0b11111111]);
      const bitReader = new UintBitsReader(buffer);
      expect(() => bitReader.values(3)).toThrow("Bytes can't be devided by 3 bits");
    });

    test('should throw if there is nothing to read', () => {
      const buffer = new Uint8Array([]);
      const bitReader = new UintBitsReader(buffer);
      expect(() => bitReader.read(1)).toThrowError('Reached bitstream end');
    });

    test('should throw for wrong bit count', () => {
      const buffer = new Uint8Array([0xff]);
      const bitReader = new UintBitsReader(buffer);
      expect(() => bitReader.read(33)).toThrowError('Unsupported bit count');
    });

    test('should throw on position overflow', () => {
      const buffer = new Uint8Array([0xff, 0xff]);
      const bitReader = new UintBitsReader(buffer);
      expect(() => bitReader.read(17)).toThrowError('Reached bitstream end');
    });
  });
});
