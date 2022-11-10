import BitVector from './bit-vector';

describe('bits-us', () => {
  describe('BitVector', () => {
    test('should grow correctly allocating bytes', () => {
      const vec = new BitVector(3);
      for (let i = 0; i < 3; i += 1) {
        vec.push(1);
      }
      expect(vec.capacity).toEqual(3);
      vec.push(1);
      expect(vec.capacity).toEqual(6);
      expect(vec.bytesAllocated).toEqual(1);
      for (let i = 0; i < 2; i += 1) {
        vec.push(1);
      }
      expect(vec.capacity).toEqual(6);
      vec.push(1);
      expect(vec.capacity).toEqual(12);
      expect(vec.bytesAllocated).toEqual(2);
    });

    test('should set bit value', () => {
      const vec = new BitVector(3);
      vec.push(1);
      vec.push(1);
      vec.push(0);
      vec.set(2, 0);
      expect(vec.get(2)).toEqual(0);
      vec.set(2, 1);
      expect(vec.get(2)).toEqual(1);
      vec.set(0, 0);
      expect(vec.get(0)).toEqual(0);
    });

    test('should iterate over bits', () => {
      const vec = new BitVector(9);
      vec.push(1);
      vec.push(1);
      vec.push(0);
      vec.push(0);
      vec.push(1);
      vec.push(0);
      expect(Array.from(vec)).toEqual([1, 1, 0, 0, 1, 0]);
    });
  });
});
