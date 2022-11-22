import { filter, map, seq } from './async-iters';

async function* asyncGenerator(): AsyncGenerator<number> {
  for (let i = 0; i < 10; i += 1) {
    yield i;
  }
}

describe('async-iters -> filter', () => {
  test('should filter async iterator', async () => {
    const array = [];
    for await (const item of filter(asyncGenerator(), (i) => i % 2 === 0)) {
      array.push(item);
    }
    expect(array).toEqual([0, 2, 4, 6, 8]);
  });
});

describe('async-iters -> map', () => {
  test('should map async iterator', async () => {
    const array = [];
    for await (const item of map(asyncGenerator(), (i) => (i * 2).toString())) {
      array.push(item);
    }
    expect(array).toEqual(['0', '2', '4', '6', '8', '10', '12', '14', '16', '18']);
  });
});

describe('async-iters -> seq', () => {
  test('should seq async iterator', async () => {
    const iterable = seq(
      filter(asyncGenerator(), (i) => i < 3),
      filter(asyncGenerator(), (i) => i > 6),
    );
    const array = [];
    for await (const item of iterable) {
      array.push(item);
    }
    expect(array).toEqual([0, 1, 2, 7, 8, 9]);
  });
});
