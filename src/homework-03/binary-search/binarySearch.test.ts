import binarySearch from './binarySearch';

describe('binarySearch', () => {
  test('contract', () => {
    expect(
      binarySearch(4, [-432, 0, 1, 1, 2, 2, 2, 3, 4, 5, 6, 98]),
    ).toEqual(8);
    expect(
      binarySearch(98, [-432, 0, 1, 1, 2, 2, 2, 3, 4, 5, 6, 98]),
    ).toEqual(11);
  });

  test('non-even array size', () => {
    expect(
      binarySearch(3, [1, 2, 3, 4, 5]),
    ).toEqual(2);
    expect(
      binarySearch(4, [1, 2, 3, 4, 5]),
    ).toEqual(3);
  });

  test('even array size', () => {
    expect(
      binarySearch(8, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
    ).toEqual(8);
  });
});
