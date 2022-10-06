import ConcreteDoublyLinkedList from './ConcreteDoublyLinkedList';

describe('ConcreteDoublyLinkedList', () => {
  const list = new ConcreteDoublyLinkedList<number>()
    .add(1)
    .add(2)
    .add(3);

  test('contract', () => {
    expect(list.head?.data).toEqual(1);
    expect(list.tail?.data).toEqual(3);
    expect(list.head?.next?.data).toEqual(2);
    expect(list.head?.next?.prev?.data).toEqual(1);
  });

  test('iterator', () => {
    expect(Array.from(list)).toEqual([1, 2, 3]);
  });
});
