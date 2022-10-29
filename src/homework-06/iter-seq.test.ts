import iterSeq from './iter-seq';

describe('iterSeq', () => {
  test('iterate numbers, set, chars', () => {
    expect([
      ...iterSeq([1, 2], new Set([3, 4]), 'bla'),
    ]).toEqual([1, 2, 3, 4, 'b', 'l', 'a']);
  });
});
