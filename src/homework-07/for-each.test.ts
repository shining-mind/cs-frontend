import forEach from './for-each';

describe('forEach', () => {
  test('should iterate large iterable with given work and pause time', async () => {
    let lastIndex = 0;
    await forEach(new Array(1e6), (_, index) => {
      lastIndex = index;
    }, { workTime: 5, pauseTime: 5 });
    expect(lastIndex).toEqual(1e6 - 1);
  });
});
