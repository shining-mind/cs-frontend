import promisify from './promisify';

describe('promisify', () => {
  test('should promisify function with zero args', async () => {
    const fn0 = (cb: (error: Error | null, result: number) => void) => {
      cb(null, 1);
    };
    const fn0Error = (cb: (error: Error | null, result: null) => void) => {
      cb(new Error('Test'), null);
    };
    await expect(promisify(fn0)()).resolves.toEqual(1);
    await expect(promisify(fn0Error)()).rejects.toBeInstanceOf(Error);
  });

  test('should promisify function with 1 arg', async () => {
    const fn1 = (arg: number, cb: (error: Error | null, result: string) => void) => {
      cb(null, arg.toString());
    };
    await expect(promisify(fn1)(125)).resolves.toEqual('125');
  });

  test('should promisify function with 2 args', async () => {
    const fn2 = (arg1: number, arg2: number, cb: (error: Error | null, result: number) => void) => {
      cb(null, arg1 + arg2);
    };
    await expect(promisify(fn2)(5, 5)).resolves.toEqual(10);
  });

  test('should promisify function with 3 args', async () => {
    const fn3 = (
      a: number,
      b: number,
      c: number,
      cb: (error: Error | null, result: boolean) => void,
    ) => {
      cb(null, a ** 2 + b ** 2 === c ** 2);
    };
    await expect(promisify(fn3)(3, 4, 5)).resolves.toEqual(true);
  });

  test('should promisify function with 4 args', async () => {
    const fn4 = (
      a: number,
      b: number,
      c: number,
      x: number,
      cb: (error: Error | null, result: number) => void,
    ) => {
      cb(null, a * x ** 2 + b * x + c);
    };
    await expect(promisify(fn4)(1, 0, 0, 2)).resolves.toEqual(4);
  });
});
