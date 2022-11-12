import iterRandom, { randomInt } from '../../homework-06/iter-random';
import iterTake from '../../homework-06/iter-take';
import BitVector from './bit-vector';

function testCaseGeneral(wordSize: 8 | 16 | 32) {
  test(`all operations should work with ${wordSize} bit word`, () => {
    const vec = new BitVector(1, wordSize);
    const n = wordSize * randomInt(1, 12);
    for (let i = 0; i < n; i += 1) {
      vec.push(1);
    }
    expect(Array.from(vec)).toEqual(Array(n).fill(1));
    for (let i = 0; i < n; i += 1) {
      vec.set(i, 0);
    }
    expect(Array.from(vec)).toEqual(Array(n).fill(0));
    for (let i = 0; i < n; i += 1) {
      expect(vec.get(i)).toEqual(0);
      vec.set(i, i % 2 === 0 ? 1 : 0);
    }
    expect(Array.from(vec)).toEqual(Array(n).fill(0).map((_, i) => (i % 2 === 0 ? 1 : 0)));
  });
}

describe('bits-us', () => {
  describe('BitVector', () => {
    testCaseGeneral(8);
    testCaseGeneral(16);
    // testCaseGeneral(32);

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

    test('get/iterator should work correctly on push/set of random data', () => {
      for (const size of iterTake(iterRandom(30, 1024), 5)) {
        const array1 = Array(size).fill(0).map(() => (Math.random() > 0.5 ? 1 : 0));
        let expectedCapacity = 1;
        const vec = new BitVector(expectedCapacity);
        array1.forEach((value) => {
          vec.push(value);
          if (vec.length >= vec.capacity) {
            expectedCapacity *= 2;
          }
        });
        expect(vec.length).toEqual(size);
        expect(vec.capacity).toEqual(expectedCapacity);
        expect(vec.bytesAllocated).toEqual(Math.ceil(expectedCapacity / 8));
        array1.forEach((value, index) => {
          expect(vec.get(index)).toEqual(value);
        });
        expect(Array.from(vec)).toEqual(array1);
        const array2 = array1.map(() => (Math.random() > 0.5 ? 1 : 0));
        array2.forEach((value, index) => {
          vec.set(index, value);
        });
        array2.forEach((value, index) => {
          expect(vec.get(index)).toEqual(value);
        });
        expect(Array.from(vec)).toEqual(array2);
      }
    });

    test('should throw error on set/get of undefined bit', () => {
      const vec = new BitVector(1);
      expect(() => vec.get(1)).toThrowError(RangeError);
      expect(() => vec.set(1, 0)).toThrowError(RangeError);
    });
  });
});
