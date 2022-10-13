import LinkedListDynamicArray from './LinkedListDynamicArray';

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
});
