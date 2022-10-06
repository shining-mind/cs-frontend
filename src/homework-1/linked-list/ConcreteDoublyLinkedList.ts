import DoublyLinkedList, { DoublyLinkedListItem } from './DoublyLinkedList';

export default class ConcreteDoublyLinkedList<T> implements DoublyLinkedList<T> {
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

  * [Symbol.iterator](): Iterator<T, void> {
    let item = this.head;
    while (item) {
      yield item.data;
      item = item.next;
    }
  }
}
