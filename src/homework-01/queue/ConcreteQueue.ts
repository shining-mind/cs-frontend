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

  pop(): T | null {
    return this.list.shift();
  }

  flush(): void {
    this.list = new ConcreteDoublyLinkedList<T>();
  }
}
