import sleep from './sleep';
import timeout from './timeout';

describe('timeout', () => {
  test('should be rejected with error: "Timeout reached"', () => {
    expect.assertions(3);
    const start = Date.now();
    return timeout(sleep(300), 200).catch((error) => {
      expect(Date.now() - start).toBeGreaterThanOrEqual(200);
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toEqual('Timeout reached');
    });
  });

  test('should be resolved before timeout', () => expect(timeout(sleep(100), 200)).resolves.toBeUndefined());
});
