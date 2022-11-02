import exec from './exec';
import Result from './result';

describe('exec', () => {
  test('exec with Result container', (done) => {
    expect.assertions(2);
    exec(function* run() {
      const result = new Result(() => 10);
      expect(yield result.map((el) => el * 2)).toEqual(20);
      expect(yield result.map((el) => el * 3)).toEqual(30);
      done();
    });
  });

  test('exec with error', (done) => {
    expect.assertions(1);
    exec(function* run() {
      const result = Result.error(10);
      try {
        yield result.then((el) => el);
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toEqual('10');
        }
      } finally {
        done();
      }
    });
  });
});
