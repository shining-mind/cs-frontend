import ConcreteStack from './ConcreteStack';

describe('ConcreteStack', () => {
  const stack = new ConcreteStack<number>()
    .push(10)
    .push(11)
    .push(12);

  test('contract', () => {
    expect(stack.head).toEqual(12);
    expect(stack.pop()).toEqual(12);
    expect(stack.head).toEqual(11);
    expect(stack.pop()).toEqual(11);
    expect(stack.pop()).toEqual(10);
    expect(() => stack.pop()).toThrowError();
  });
});
