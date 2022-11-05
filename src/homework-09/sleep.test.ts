import sleep from './sleep';

describe('sleep', () => {
  test('should sleep for 200 ms', () => {
    const start = Date.now();
    return sleep(200).then(() => {
      expect(Date.now() - start).toBeGreaterThanOrEqual(200);
    });
  });
});
