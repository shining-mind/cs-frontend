import VectorDynamicArray from './VectorDynamicArray';

describe('VectorDynamicArray', () => {
  test('contract', () => {
    const arr = new VectorDynamicArray(1);

    arr.add(1);
    arr.add(2);
    arr.add(3);
    arr.add(4);
    arr.add(5);

    expect(arr.get(0)).toEqual(1);
    expect(arr.get(1)).toEqual(2);
    expect(arr.get(4)).toEqual(5);
  });

  test('iterator - filters out undefined', () => {
    const arr = new VectorDynamicArray(6);
    arr.add(1);
    arr.add(2);
    arr.add(3);
    expect(Array.from(arr)).toEqual([1, 2, 3]);
  });

  test('iterator - after vector resize', () => {
    const arr = new VectorDynamicArray(1);
    arr.add(1);
    arr.add(2);
    arr.add(3);
    arr.add(4);
    arr.add(5);
    expect(arr.length).toEqual(5);
    expect(Array.from(arr)).toEqual([1, 2, 3, 4, 5]);
  });
});
