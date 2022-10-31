import iterZip from './iter-zip';

describe('iterZip', () => {
  test('make tuples from numbers, set, chars', () => {
    expect([
      ...iterZip([1, 2], new Set([3, 4]), 'bl'),
    ]).toEqual([[1, 3, 'b'], [2, 4, 'l']]);
  });

  test('make only full tuples from different size iterables', () => {
    expect([
      ...iterZip([1, 2], new Set([3, 4, 5]), 'blce'),
    ]).toEqual([[1, 3, 'b'], [2, 4, 'l']]);
  });
});
