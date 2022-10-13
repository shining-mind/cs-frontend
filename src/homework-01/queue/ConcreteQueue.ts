import ConcreteDoublyLinkedList from '../linked-list/ConcreteDoublyLinkedList';
import Queue from './Queue';

export default class ConcreteQueue<T> implements Queue<T> {
  protected list = new ConcreteDoublyLinkedList<T>();

  get head(): T | null {
    return this.list.head?.data || null;
  }

  push(data: T) {
    this.list.add(data);
    return this;
  }

  pop(): T {
    const data = this.list.shift();
    if (data === null) {
      throw new Error('Empty queue');
    }
    return data;
  }

  flush(): void {
    this.list = new ConcreteDoublyLinkedList<T>();
  }
}
