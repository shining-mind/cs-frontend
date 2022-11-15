import IterRange from '../homework-06/iter-range';
import promiseAllLimit from './promise-all-limit';
import sleep from './sleep';

function createLog(): [string[], <T>(promise: Promise<T> | T, index: number) => Promise<T>] {
  const logs: string[] = [];
  return [logs, (promise, index) => {
    logs.push(`Start fn${index}`);
    return Promise.resolve(promise).finally(() => {
      logs.push(`End fn${index}`);
    });
  }];
}

describe('promiseAllLimit', () => {
  const [logs, logger] = createLog();
  const functions = [
    () => logger<number>(sleep(30).then(() => 1), 1),
    () => logger<number>(sleep(50).then(() => 2), 2),
    () => logger<number>(sleep(20).then(() => 3), 3),
    () => logger<number>(sleep(200).then(() => 4), 4),
    () => logger<number>(sleep(20).then(() => 5), 5),
    () => logger<number>(sleep(20).then(() => 6), 6),
    () => logger<number>(sleep(20).then(() => 7), 7),
    () => logger<number>(sleep(20).then(() => 8), 8),
    () => logger<string>(sleep(20).then(() => 'done'), 9),
  ];
  beforeEach(() => {
    logs.splice(0, logs.length);
  });

  test('shoud run maximum 1 task in parallel', async () => {
    const start = Date.now();
    const results = await promiseAllLimit(functions, 1);
    expect(results).toEqual(Array.from<number | string>(new IterRange(1, 8)).concat(['done']));
    expect(Date.now() - start).toBeGreaterThanOrEqual(400);
    expect(logs).toEqual(Array(9).fill('').flatMap((_, i) => [`Start fn${i + 1}`, `End fn${i + 1}`]));
  });

  test('shoud run maximum 2 tasks in parallel', async () => {
    const start = Date.now();
    const results = await promiseAllLimit(functions, 2);
    expect(results).toEqual(Array.from<number | string>(new IterRange(1, 8)).concat(['done']));
    expect(Date.now() - start).toBeGreaterThanOrEqual(250);
    expect(Date.now() - start).toBeLessThanOrEqual(400);
    expect(logs).toEqual([
      'Start fn1', // pending - fn1
      'Start fn2', // pending - fn1, fn2
      'End fn1', // pending - fn2
      'Start fn3', // pending - fn2, fn3
      'End fn2', // pending - fn3
      'Start fn4', // pending - fn3, fn4
      'End fn3', // pending - fn4
      'Start fn5', // pending - fn4, fn5
      'End fn5', // pending - fn4
      'Start fn6', // pending - fn4, fn6
      'End fn6', // pending - fn4
      'Start fn7', // pending - fn4, fn7
      'End fn7', // pending - fn4
      'Start fn8', // pending - fn4, fn8
      'End fn8', // pending - fn4
      'Start fn9', // pending - fn4, fn9
      'End fn9', // pending - fn4
      'End fn4', // pending - None
    ]);
  });

  test('should work with sync functions', async () => {
    const expected = [1, new Set([2]), 'foo'];
    const results1 = await promiseAllLimit([
      () => expected[0], () => expected[1], () => expected[2],
    ], 2);
    expect(results1).toEqual(expected);
    const results2 = await promiseAllLimit([
      () => logger(expected[0], 1),
      () => logger(expected[1], 2),
      () => logger(expected[2], 3),
    ], 2);
    expect(results2).toEqual(expected);
    expect(logs).toEqual([
      'Start fn1',
      'Start fn2',
      'End fn1',
      'End fn2',
      'Start fn3',
      'End fn3',
    ]);
  });
});
