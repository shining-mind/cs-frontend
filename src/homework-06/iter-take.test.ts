import primeGenerator from '../homework-03/utils/prime-generator';
import iterRandom from './iter-random';
import iterTake from './iter-take';

describe('iterTake', () => {
  test('take 5 numbers from iterRandom', () => {
    const result = Array.from(iterTake(iterRandom(0, 5), 5));
    expect(result).toHaveLength(5);
  });

  test('take 5 primes from primeGenerator', () => {
    expect([...iterTake(primeGenerator(), 5)]).toEqual([2, 3, 5, 7, 11]);
  });
});
