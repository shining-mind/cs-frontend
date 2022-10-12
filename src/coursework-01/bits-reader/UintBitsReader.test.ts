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

    test('should throw if nothing to read', () => {
      const buffer = new Uint8Array([]);
      const bitReader = new UintBitsReader(buffer);
      expect(() => bitReader.read(1)).toThrowError('Reached bitstream end');
    });

    test('should throw for wrong bit count', () => {
      const buffer = new Uint8Array([0xff]);
      const bitReader = new UintBitsReader(buffer);
      expect(() => bitReader.read(33)).toThrowError('Unsupported bit count');
    });
  });
});
