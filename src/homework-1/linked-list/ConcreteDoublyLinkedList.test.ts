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

  test('reverse iterator', () => {
    expect(Array.from(list.reversed())).toEqual([3, 2, 1]);
  });

  test('shift - size 1', () => {
    const local = new ConcreteDoublyLinkedList<number>();
    local.add(1);
    expect(local.shift()).toEqual(1);
    expect(local.head).toEqual(null);
    expect(local.tail).toEqual(null);
  });

  test('shift - size *', () => {
    const local = new ConcreteDoublyLinkedList<number>();
    local.add(1).add(2).add(3);
    expect(local.shift()).toEqual(1);
    expect(Array.from(local)).toEqual([2, 3]);
    expect(Array.from(local.reversed())).toEqual([3, 2]);
  });

  test('pop - size 1', () => {
    const local = new ConcreteDoublyLinkedList<number>();
    local.add(1);
    expect(local.pop()).toEqual(1);
    expect(local.head).toEqual(null);
    expect(local.tail).toEqual(null);
  });

  test('pop - size *', () => {
    const local = new ConcreteDoublyLinkedList<number>();
    local.add(1).add(2).add(3);
    expect(local.pop()).toEqual(3);
    expect(Array.from(local)).toEqual([1, 2]);
    expect(Array.from(local.reversed())).toEqual([2, 1]);
  });
});
