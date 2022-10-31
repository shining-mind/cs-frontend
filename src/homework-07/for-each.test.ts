import forEach from './for-each';

describe('forEach', () => {
  test('should iterate large iterable with given work and pause time', async () => {
    let lastIndex = 0;
    await forEach(new Array(1e6), (_, index) => {
      lastIndex = index;
    }, { workTime: 5, pauseTime: 5 });
    expect(lastIndex).toEqual(1e6 - 1);
  });

  test('should be aborted using abort controller', async () => {
    const controller = new AbortController();
    let pauses = 0;
    const onPause = () => {
      pauses += 1;
    };
    try {
      setTimeout(() => controller.abort(), 9);
      await forEach(
        new Array(50e6),
        () => {},
        {
          signal: controller.signal, workTime: 5, pauseTime: 5, onPause,
        },
      );
      fail('Promise must be rejected');
    } catch (e) {
      expect(pauses).toEqual(1);
      expect(e).toBeUndefined();
    }
  });

  test('should be rejected if callback throws', () => {
    const promise = forEach(
      new Array(10),
      () => {
        throw new Error();
      },
    );
    return expect(promise).rejects.toBeInstanceOf(Error);
  });
});
