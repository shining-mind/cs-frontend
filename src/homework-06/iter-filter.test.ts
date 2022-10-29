import iterFilter from './iter-filter';
import iterTake from './iter-take';
import iterRandom from './iter-random';

describe('iterFilter', () => {
  test('filter random values greater than 5 and take first 10', () => {
    const result = Array.from(iterTake(iterFilter(iterRandom(0, 10), (el) => el > 5), 10));
    expect(result).toHaveLength(10);
    expect(result.every((el) => el > 5)).toBeTruthy();
  });
});
