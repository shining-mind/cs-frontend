import ConcreteDoubleEndedQueue from './ConcreteDoubleEndedQueue';

describe('ConcreteDoubleEndedQueue', () => {
  const queue = new ConcreteDoubleEndedQueue<number>();

  beforeEach(() => {
    queue
      .push(10)
      .unshift(11)
      .push(12);
  });

  afterEach(() => {
    queue.flush();
  });

  test('contract', () => {
    expect(queue.pop()).toEqual(12);
    expect(queue.shift()).toEqual(11);
    expect(queue.pop()).toEqual(10);
    expect(queue.pop()).toBeNull();
  });
});
