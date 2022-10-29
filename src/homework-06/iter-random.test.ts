import iterRandom from './iter-random';

describe('iterRandom', () => {
  test('generates random numbers between 0 and 5', () => {
    const it = iterRandom(0, 5);
    for (let i = 0; i < 100; i += 1) {
      const { value } = it.next();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(5);
    }
  });

  test('is iterable', () => {
    const it = iterRandom(0, 5);
    let i = 0;
    for (const value of it) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(5);
      i += 1;
      if (i >= 5) {
        break;
      }
    }
  });
});
