import DoublyLinkedList, { DoublyLinkedListItem } from './DoublyLinkedList';

export default class ConcreteDoublyLinkedList<T> implements DoublyLinkedList<T>, Iterable<T> {
  head: DoublyLinkedListItem<T> | null = null;

  tail: DoublyLinkedListItem<T> | null = null;

  add(data: T): this {
    const item = {
      data,
      prev: this.tail,
      next: null,
    };
    if (this.head === null) {
      this.head = item;
    }
    if (this.tail !== null) {
      this.tail.next = item;
    }
    this.tail = item;

    return this;
  }

  * values(reverse: boolean = false): Iterator<T> {
    let item = reverse ? this.tail : this.head;
    while (item) {
      yield item.data;
      item = reverse ? item.prev : item.next;
    }
  }

  reversed(): Iterable<T> {
    return {
      [Symbol.iterator]: () => this.values(true),
    };
  }

  [Symbol.iterator](): Iterator<T> {
    return this.values();
  }
}
