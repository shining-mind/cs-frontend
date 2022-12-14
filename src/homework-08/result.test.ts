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

  test('should catch runtime error', () => {
    expect.assertions(2);
    new Result(() => 2)
      .map((x) => `${x}`)
      .map(() => JSON.parse("{'a':1}"))
      .catch((error) => {
        expect(error).toBeInstanceOf(Error);
        return 1;
      })
      .then((x) => {
        expect(x).toEqual(1);
      });
  });

  test('should map result inside the result', () => {
    expect.assertions(3);
    const result = new Result(() => 10);
    const mappedResult = result
      .map((number) => new Result(() => number * 2))
      .map((result2) => new Result(() => result2));
    mappedResult.then((result1) => {
      expect(result1).toBeInstanceOf(Result);
      result1.then((result2) => {
        expect(result2).toBeInstanceOf(Result);
        expect(result2.data).toEqual(20);
      });
    });
  });

  test('map should not throw on result with error', () => {
    expect.assertions(1);
    Result.error(2)
      .map((v) => v)
      .catch((error) => {
        if (error instanceof Error) {
          expect(error.message).toEqual('2');
        }
      });
  });

  test('should bind error result', () => {
    expect.assertions(3);
    new Result(() => 10)
      .bind((el) => Result.error(el))
      .catch((error) => {
        if (error instanceof Error) {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toEqual('10');
        }
      })
      .then(() => {
        expect(true).toBeTruthy();
      });
  });

  test('should bind scalar value', () => {
    expect.assertions(2);
    new Result(() => 10)
      .bind((el) => el * 2)
      .then((value) => {
        expect(value).toEqual(20);
      })
      .then(() => {
        expect(true).toBeTruthy();
      });
  });

  test('result methods should chain', () => {
    expect.assertions(3);
    new Result(() => 10)
      .map((el) => el * 2)
      .bind((el) => Result.error(el))
      .catch((error) => {
        if (error instanceof Error) {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toEqual('20');
        }
      })
      .then(() => {
        expect(true).toBeTruthy();
      });
  });

  test('chain map different types', () => {
    expect.assertions(4);
    new Result(() => 97)
      .map((el) => String.fromCodePoint(el))
      .map((el) => el.toUpperCase())
      .then((el) => {
        expect(el).toEqual('A');
      })
      .then(() => {
        expect(true).toBeTruthy();
      });
    new Result(() => [1, 2, 3])
      .map((el) => el.reduce((acc, x) => acc + x, 0))
      .map((el) => el.toString())
      .then((el) => {
        expect(el).toEqual('6');
      })
      .then(() => {
        expect(true).toBeTruthy();
      });
  });

  test('chain bind different types', () => {
    expect.assertions(4);
    new Result(() => 97)
      .bind((el) => String.fromCodePoint(el))
      .bind((el) => el.toUpperCase())
      .then((el) => {
        expect(el).toEqual('A');
      })
      .then(() => {
        expect(true).toBeTruthy();
      });
    new Result(() => [1, 2, 3])
      .bind((el) => el.reduce((acc, x) => acc + x, 0))
      .bind((el) => el.toString())
      .then((el) => {
        expect(el).toEqual('6');
      })
      .then(() => {
        expect(true).toBeTruthy();
      });
  });
});
