import iterMapSeq from './iter-map-seq';

describe('iterMapSeq', () => {
  test('map numbers', () => {
    expect([
      ...iterMapSeq([1, 2, 3], [(el: number) => el * 2, (el: number) => el - 1]),
    ]).toEqual([1, 3, 5]);
  });
});
