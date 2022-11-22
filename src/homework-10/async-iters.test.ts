import sleep from '../homework-09/sleep';
import {
  filter, map, seq, take, every, any, repeat,
} from './async-iters';

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

describe('async-iters -> take', () => {
  test('should take from async iterator', async () => {
    const array = [];
    for await (const item of take(asyncGenerator(), 3)) {
      array.push(item);
    }
    expect(array).toEqual([0, 1, 2]);
  });

  test('should take from async iterator only available values', async () => {
    const array = [];
    for await (const item of take(filter(asyncGenerator(), (x) => x < 3), 5)) {
      array.push(item);
    }
    expect(array).toEqual([0, 1, 2]);
  });
});

describe('async-iters -> every', () => {
  test('every should end underlying iterator', async () => {
    const array = [];
    const iterable = asyncGenerator();
    for await (const item of every(iterable, (i) => i < 3)) {
      array.push(item);
    }
    const rest = [];
    for await (const i of iterable) {
      rest.push(i);
    }
    expect(array).toEqual([0, 1, 2]);
    expect(rest).toEqual([]);
  });
});

describe('async-iters -> any', () => {
  // Total time: 101
  async function* asyncTask1() {
    await sleep(1);
    yield 1;
    await sleep(100);
    yield 2;
  }

  // Total time: 111
  async function* asyncTask2() {
    await sleep(10);
    yield 3;
    await sleep(1);
    yield 4;
    await sleep(100);
    yield 5; // this will be ignored
  }

  test('any should return first value of each pair', async () => {
    const array = [];
    for await (const item of any(asyncTask1(), asyncTask2())) {
      array.push(item);
    }
    expect(array).toEqual([1, 4]);
  });
});

describe('async-iters -> repeat', () => {
  async function* asyncTask() {
    for (let i = 0; i < 3; i += 1) {
      yield i;
    }
  }
  test('should repeat given iterator', async () => {
    const array = [];
    for await (const item of take(repeat(() => asyncTask()), 7)) {
      array.push(item);
    }
    expect(array).toEqual([0, 1, 2, 0, 1, 2, 0]);
  });
});
