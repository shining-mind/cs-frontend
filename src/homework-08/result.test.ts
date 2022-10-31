import Result from './result';

describe('Result', () => {
  test('should create result with data', () => {
    expect.assertions(1);
    Result.ok(123).then((data) => {
      expect(data).toEqual(123);
    });
  });

  test('should create result with error', () => {
    expect.assertions(1);
    Result.error('bad').catch((e) => {
      expect(e).toEqual('bad');
    });
  });

  test('should map result to another result', () => {
    expect.assertions(2);
    const result = new Result(() => 10);
    const mappedResult = result.map((number) => number * 2);
    expect(result === mappedResult).toBeFalsy();
    mappedResult.then((number) => {
      expect(number).toEqual(20);
    });
  });

  test('should bind result', () => {
    expect.assertions(1);
    new Result(() => 10).bind((el) => Result.error(el)).catch((error) => {
      expect(error).toEqual(10);
    });
  });

  test('result methods should chain', () => {
    const result = new Result(() => 10);
    result.map((el) => el * 2).bind((el) => Result.error(el)).catch((err) => {
      expect(err).toEqual(20);
    });
  });
});
