import UintLSBReader from './uint-lsb-reader';

describe('bits-us', () => {
  describe('UintLSBReader', () => {
    test('read 14 bits numbers', () => {
      const bitReader = new UintLSBReader(new Uint8Array([0x8f, 0x01, 0x4b, 0x10]));
      expect(bitReader.read(14)).toEqual(399);
      expect(bitReader.read(14)).toEqual(300);
    });

    test('read by 1 bit', () => {
      const bitReader = new UintLSBReader(new Uint8Array([0b10011001, 0b10100001]));
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
      const bitReader = new UintLSBReader(new Uint8Array([0b10011001, 0b10100001]));
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
      const bitReader = new UintLSBReader(new Uint8Array([0b10011001, 0b10100001]));
      expect(bitReader.read(1)).toEqual(1);
      expect(bitReader.read(1)).toEqual(0);
      expect(bitReader.read(1)).toEqual(0);
      expect(bitReader.read(1)).toEqual(1);
      bitReader.seekWithReset(1);
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
      expect(new UintLSBReader(new Uint8Array([0x01, 0x00, 0x00, 0x00])).read(32)).toEqual(1);
      expect(new UintLSBReader(new Uint8Array([0x98, 0x3f, 0x01, 0x00])).read(32)).toEqual(81816);
    });

    test('should read numbers greater than max uint31', () => {
      expect(new UintLSBReader(new Uint8Array([0xff, 0xff, 0xff, 0x7f])).read(32))
        .toEqual((2 ** 31 - 1));
      expect(new UintLSBReader(new Uint8Array([0x00, 0x00, 0x00, 0x80])).read(32))
        .toEqual(2 ** 31);
      expect(new UintLSBReader(new Uint8Array([0xff, 0xff, 0xff, 0xff])).read(32))
        .toEqual(2 ** 32 - 1);
      expect(new UintLSBReader(new Uint8Array([0xff, 0xff, 0xff, 0x0f, 0xff])).read(40))
        .toEqual(1095485095935);
      expect(new UintLSBReader(new Uint8Array([0xff, 0xff, 0xff, 0x0f, 0x00, 0x7f])).read(48))
        .toEqual(139638245163007);
    });

    test('should read uint53', () => {
      const buffer = new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
      expect(new UintLSBReader(buffer).read(53)).toEqual(2 ** 53 - 1);
    });

    test('rewind', () => {
      const bitReader = new UintLSBReader(new Uint8Array([0xff, 0xff]));
      expect(bitReader.read(16)).toEqual(65535);
      bitReader.rewind();
      expect(bitReader.read(8)).toEqual(255);
    });

    test('iterate 3 bit numbers', () => {
      const bitReader = new UintLSBReader(new Uint8Array([0b11100111, 0b01111001, 0b10011110]));
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

    test('should iterate bits', () => {
      expect(Array.from(new UintLSBReader(new Uint8Array([0b10100111]))))
        .toEqual([1, 1, 1, 0, 0, 1, 0, 1]);
    });

    test('should throw if byte array can not be divided by given bits', () => {
      expect(() => new UintLSBReader(new Uint8Array([0b11111111])).values(3)).toThrow("Bytes can't be devided by 3 bits");
    });

    test('should throw if there is nothing to read', () => {
      expect(() => new UintLSBReader(new Uint8Array([])).read(1)).toThrowError('Reached bitstream end');
    });

    test('should throw for wrong bit count', () => {
      expect(() => new UintLSBReader(new Uint8Array([0xff])).read(54)).toThrowError('Unsupported bit count');
    });

    test('should throw on position overflow', () => {
      expect(() => new UintLSBReader(new Uint8Array([0xff, 0xff])).read(17)).toThrowError('Reached bitstream end');
    });
  });
});
