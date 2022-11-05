import { setImmediate, clearImmediate } from './immediate';

describe('immediate', () => {
  test('should set immediate and execute callback', (done) => {
    expect.assertions(1);
    setImmediate(() => {
      expect(true).toBeTruthy();
      done();
    });
  });

  test('should set immediate and clear immediate', (done) => {
    const immediate = setImmediate(() => {
      done(new Error('Should not execute'));
    });
    clearImmediate(immediate);
    done();
  });

  test('should set multiple immediate and execute them', (done) => {
    expect.assertions(2);
    setImmediate(() => {
      expect(true).toBeTruthy();
    });
    setImmediate(() => {
      expect(true).toBeTruthy();
      done();
    });
  });

  test('should set multiple immediate and clear only one', (done) => {
    expect.assertions(1);
    const immediate = setImmediate(() => {
      done(new Error('Should not execute'));
    });
    setImmediate(() => {
      expect(true).toBeTruthy();
      done();
    });
    clearImmediate(immediate);
  });
});
