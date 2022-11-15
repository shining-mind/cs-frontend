/* eslint-disable no-plusplus */
import SyncPromise from './sync-promise';

function assertAsyncResult<T>(
  time: number,
  promise: PromiseLike<T>,
  expected: T,
  done: Function,
) {
  expect.assertions(2);
  const start = Date.now();
  promise
    .then(
      (value) => {
        expect(value).toEqual(expected);
        expect(Date.now() - start).toBeGreaterThanOrEqual(time);
        done();
      },
      (error) => {
        done(new Error(error));
      },
    );
}

const assertAsyncResultAfter5MS = assertAsyncResult.bind(null, 5);

describe('SyncPromise', () => {
  test('should run then synchronously', () => {
    expect.assertions(2);
    let i = 1;
    SyncPromise.resolve(null).then(() => {
      expect(i++).toEqual(1);
    });
    expect(i++).toEqual(2);
  });

  test('should run then asynchronously', (done) => {
    const promise = new SyncPromise<number>((resolve) => {
      setTimeout(() => resolve(2), 5);
    });
    assertAsyncResultAfter5MS(promise, 2, done);
  });

  test('should unwrap promise', (done) => {
    const promise = new SyncPromise<number>((resolve) => {
      resolve(new SyncPromise<number>((resolve2) => {
        setTimeout(() => resolve2(1), 5);
      }));
    });
    assertAsyncResultAfter5MS(promise, 1, done);
  });

  test('should unwrap promise from then', (done) => {
    expect.assertions(2);
    SyncPromise
      .resolve(1)
      .then((value) => SyncPromise.resolve(value * 2))
      .then((value) => {
        expect(value).toEqual(2);
        return value;
      })
      .then((value) => Promise.resolve(value * 2))
      .then((value) => {
        expect(value).toEqual(4);
        done();
      });
  });

  test('should unwrap promise from catch', (done) => {
    expect.assertions(2);
    new SyncPromise((_, reject) => {
      setImmediate(() => reject(1));
    })
      .catch((reason) => SyncPromise.resolve(reason * 2))
      .then((value) => {
        expect(value).toEqual(2);
        throw value;
      })
      .catch((reason) => Promise.resolve(reason * 2))
      .then((value) => {
        expect(value).toEqual(4);
        done();
      });
  });

  test('then should wrap thrown error into the promise', (done) => {
    expect.assertions(2);
    SyncPromise.resolve(1)
      .then((value) => {
        throw new Error(value.toString());
      })
      .catch((reason) => {
        expect(reason).toBeInstanceOf(Error);
        expect((reason as Error).message).toEqual('1');
        done();
      });
  });

  test('catch should wrap thrown error into the promise', (done) => {
    expect.assertions(1);
    new SyncPromise((_, reject) => {
      setImmediate(() => reject(1));
    })
      .catch((reason) => {
        throw new Error(reason);
      })
      .catch((reason) => {
        expect(reason).toBeInstanceOf(Error);
        done();
      });
  });

  test('then should return promise with same data if null given', async () => {
    expect.assertions(1);
    await SyncPromise.resolve(1).then(null).then((value) => {
      expect(value).toEqual(1);
    });
  });

  test('catch should return promise with same reason if null given', async () => {
    expect.assertions(1);
    await new SyncPromise((_, reject) => reject(1)).catch(null).catch((reason) => {
      expect(reason).toEqual(1);
    });
  });

  test('should return promise value after catch call on resolved promise', (done) => {
    expect.assertions(2);
    SyncPromise
      .resolve(1)
      .catch(() => {})
      .then((value) => {
        expect(value).toEqual(1);
      });
    new SyncPromise((resolve) => {
      setTimeout(() => resolve(1), 5);
    })
      .catch(() => {})
      .then((value) => {
        expect(value).toEqual(1);
        done();
      });
  });

  test('should return promise reason after then call on rejected promise', (done) => {
    expect.assertions(1);
    new SyncPromise((_, reject) => {
      setTimeout(() => reject(1), 5);
    })
      .then(() => {})
      .catch((value) => {
        expect(value).toEqual(1);
        done();
      });
  });

  test('should ignore reject after resolve', (done) => {
    expect.assertions(1);
    new SyncPromise((resolve, reject) => {
      resolve(1);
      reject(new Error());
    })
      .then((value) => {
        expect(value).toEqual(1);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('should ignore resolve after reject', (done) => {
    expect.assertions(1);
    new SyncPromise((resolve, reject) => {
      reject(new Error());
      resolve(1);
    })
      .then(() => {
        done(new Error('Failed'));
      })
      .catch((error) => {
        expect(error).toBeInstanceOf(Error);
        done();
      });
  });

  describe('finally', () => {
    test('should return new promise on finally', (done) => {
      const promise = new SyncPromise<number>((resolve) => {
        setTimeout(() => resolve(1), 5);
      });
      const newPromise = promise.finally(() => {});
      assertAsyncResultAfter5MS(newPromise, 1, done);
    });

    test('sync should wrap error in finally', (done) => {
      expect.assertions(2);
      const promise = SyncPromise.resolve(1);
      promise.finally(() => {
        throw new Error();
      })
        .catch((error) => {
          expect(error).toBeInstanceOf(Error);
          promise.then((value) => {
            expect(value).toEqual(1);
            done();
          });
        });
    });

    test('async should wrap error in finally', (done) => {
      expect.assertions(1);
      new SyncPromise<number>((resolve) => {
        setTimeout(() => resolve(1), 5);
      })
        .finally(() => {
          throw new Error();
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(Error);
          done();
        });
    });

    test('should return same promise if finally has no callback', (done) => {
      expect.assertions(1);
      SyncPromise.resolve(1).finally().then((value) => {
        expect(value).toEqual(1);
        done();
      });
    });
  });
});
