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
});
