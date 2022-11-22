import { randomInt } from '../homework-06/iter-random';
import sleep from '../homework-09/sleep';
import { filter, map } from './async-iters';

async function* asyncGenerator(): AsyncGenerator<number> {
  for (let i = 0; i < 10; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await sleep(randomInt(5, 10));
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
