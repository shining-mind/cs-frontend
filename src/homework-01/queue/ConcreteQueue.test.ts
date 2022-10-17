import ConcreteQueue from './ConcreteQueue';

describe('ConcreteQueue', () => {
  const queue = new ConcreteQueue<number>();

  beforeEach(() => {
    queue
      .push(10)
      .push(11)
      .push(12);
  });

  afterEach(() => {
    queue.flush();
  });

  test('contract', () => {
    expect(queue.head).toEqual(10);
    expect(queue.pop()).toEqual(10);
    expect(queue.head).toEqual(11);
    expect(queue.pop()).toEqual(11);
    expect(queue.pop()).toEqual(12);
    expect(queue.pop()).toBeNull();
  });
});
