import iterEnumerate from './iter-enumerate';
import iterRandom from './iter-random';
import iterTake from './iter-take';

describe('iterEnumerate', () => {
  test('enumerate first 3 random numbers', () => {
    const result = Array.from(iterEnumerate(iterTake(iterRandom(0, 10), 3)));
    expect(result).toHaveLength(3);
    expect(result.map(([i]) => i)).toEqual([0, 1, 2]);
  });
});
