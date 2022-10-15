import LinkedListDynamicArray from './LinkedListDynamicArray';

function* range(from: number, to: number) {
  for (let i = from; i <= to; i += 1) {
    yield i;
  }
}

class TestLLDynamicArray<T> extends LinkedListDynamicArray<T> {
  get arrayCount() {
    return Array.from(this.list).length;
  }

  grow(size?: number) {
    return super.grow(size);
  }

  shrink(size?: number) {
    return super.shrink(size);
  }
}

describe('LinkedListDynamicArray', () => {
  test('contract', () => {
    const arr = new LinkedListDynamicArray(3);
    arr.add(1);
    arr.add(2);
    arr.add(3);
    arr.add(4);
    arr.add(5);
    expect(arr.length).toEqual(5);
    expect(arr.get(0)).toEqual(1);
    expect(arr.get(1)).toEqual(2);
    expect(arr.get(4)).toEqual(5);
  });

  test('iterator', () => {
    const arr = new LinkedListDynamicArray(3);
    arr.add(1);
    arr.add(2);
    arr.add(3);
    expect(Array.from(arr)).toEqual([1, 2, 3]);
  });

  test('grow', () => {
    const arr = new TestLLDynamicArray(3);
    arr.grow();
    expect(arr.arrayCount).toEqual(1);
  });

  test('shrink', () => {
    const arr = new TestLLDynamicArray(3);
    arr.grow(4);
    expect(arr.arrayCount).toEqual(2);
    arr.shrink(3);
    expect(arr.arrayCount).toEqual(1);
  });

  test('shrink overflow', () => {
    const arr = new TestLLDynamicArray(3);
    arr.grow();
    expect(arr.arrayCount).toEqual(1);
    arr.shrink(4);
    expect(arr.arrayCount).toEqual(0);
  });

  // Выводы при написании сложного алгоритма:
  // 1. Определить крайние случаи и составить тест-кейсы
  // 2. Декомпозировать алгоритм на основные части
  // 3. Реализовать каждую часть последовательно
  describe('splice', () => {
    let arr: LinkedListDynamicArray<number>;
    beforeEach(() => {
      arr = new LinkedListDynamicArray(3);
      for (const value of range(1, 12)) {
        arr.add(value);
      }
    });

    test('replace items at the start', () => {
      expect(arr.splice(0, 3, ...[3, 2, 1])).toEqual([1, 2, 3]);
      expect(arr.length).toEqual(12);
      expect(Array.from(arr)).toEqual([3, 2, 1].concat(Array.from(range(4, 12))));
    });

    test('replace items in few chunks', () => {
      expect(arr.splice(1, 3, ...[3, 2, 1])).toEqual([2, 3, 4]);
      expect(arr.length).toEqual(12);
      expect(Array.from(arr)).toEqual([1, 3, 2, 1].concat(Array.from(range(5, 12))));
    });

    test('replace items and add to an end', () => {
      expect(arr.splice(11, 1, ...[13, 14, 15])).toEqual([12]);
      expect(arr.length).toEqual(14);
      expect(Array.from(arr)).toEqual(Array.from(range(1, 11)).concat([13, 14, 15]));
    });

    test('add items to an end', () => {
      expect(arr.splice(12, 0, ...[13, 14, 15])).toEqual([]);
      expect(arr.length).toEqual(15);
      expect(Array.from(arr)).toEqual(Array.from(range(1, 15)));
    });

    test('add items to middle', () => {
      expect(arr.splice(2, 0, ...[1, 2])).toEqual([]);
      expect(arr.length).toEqual(14);
      expect(Array.from(arr)).toEqual([1, 2].concat(Array.from(range(1, 12))));
    });

    test('replace and add items to middle', () => {
      expect(arr.splice(2, 3, ...[1, 2, 3, 4, 5])).toEqual([3, 4, 5]);
      expect(arr.length).toEqual(14);
      expect(Array.from(arr)).toEqual([1, 2, 1, 2, 3, 4, 5].concat(Array.from(range(6, 12))));
    });

    test('delete first 3 items', () => {
      expect(arr.splice(0, 3)).toEqual([1, 2, 3]);
      expect(arr.length).toEqual(9);
      expect(Array.from(arr)).toEqual(Array.from(range(4, 12)));
    });

    test('delete last 3 items', () => {
      expect(arr.splice(9, 3)).toEqual([10, 11, 12]);
      expect(arr.length).toEqual(9);
      expect(Array.from(arr)).toEqual(Array.from(range(1, 9)));
    });

    test('delete items in middle', () => {
      expect(arr.splice(5, 3)).toEqual([6, 7, 8]);
      expect(arr.length).toEqual(9);
      expect(Array.from(arr)).toEqual(Array.from(range(1, 5)).concat(Array.from(range(9, 12))));
    });

    test('replace items and delete', () => {
      expect(arr.splice(5, 5, ...[1, 2, 3])).toEqual([6, 7, 8, 9, 10]);
      expect(arr.length).toEqual(10);
      expect(Array.from(arr)).toEqual(Array.from(range(1, 5)).concat([1, 2, 3, 11, 12]));
    });

    test('test splice in single chunk', () => {
      const local = new LinkedListDynamicArray(12);
      for (const value of range(1, 12)) {
        local.add(value);
      }
      expect(local.splice(0, 5)).toEqual(Array.from(range(1, 5)));
      expect(Array.from(local)).toEqual(Array.from(range(6, 12)));
      expect(local.length).toEqual(7);
      expect(local.splice(1, 3, ...[1, 2])).toEqual([7, 8, 9]);
      expect(Array.from(local)).toEqual([6, 1, 2, 10, 11, 12]);
      expect(local.length).toEqual(6);
    });
  });
});
