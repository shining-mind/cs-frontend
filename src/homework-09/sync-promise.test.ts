/* eslint-disable no-plusplus */
import { SyncPromise } from './sync-promise';

describe('SyncPromise', () => {
  test('should run then synchronously', () => {
    expect.assertions(2);
    let i = 1;
    SyncPromise.resolve(null).then(() => {
      expect(i++).toEqual(1);
    });
    expect(i++).toEqual(2);
  });

  test.only('should run then asynchronously', (done) => {
    expect.assertions(2);
    const start = Date.now();
    const promise = new SyncPromise<number>((resolve) => {
      setTimeout(() => resolve(2), 10);
    });
    promise
      .then(
        (value) => {
          expect(value).toEqual(2);
          expect(Date.now() - start).toBeGreaterThanOrEqual(10);
          done();
        },
        (error) => {
          done(error);
        },
      );
  });
});
