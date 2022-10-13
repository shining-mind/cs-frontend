import DoublyLinkedList, { DoublyLinkedListItem } from './DoublyLinkedList';

export default class ConcreteDoublyLinkedList<T> implements DoublyLinkedList<T>, Iterable<T> {
  #head: DoublyLinkedListItem<T> | null = null;

  #tail: DoublyLinkedListItem<T> | null = null;

  get head() {
    return Object.freeze(this.#head);
  }

  get tail() {
    return Object.freeze(this.#tail);
  }

  unshift(data: T): this {
    const item = {
      data,
      prev: null,
      next: this.#head,
    };
    if (this.#tail === null) {
      this.#tail = item;
    } else if (this.#head !== null) {
      this.#head.prev = item;
    }
    this.#head = item;
    return this;
  }

  add(data: T): this {
    const item = {
      data,
      prev: this.#tail,
      next: null,
    };
    if (this.#head === null) {
      this.#head = item;
    } else if (this.#tail !== null) {
      this.#tail.next = item;
    }
    this.#tail = item;

    return this;
  }

  shift() {
    const item = this.#head;
    if (item === null) {
      return null;
    }
    // reset tail if list has only one item
    if (this.#head === this.#tail) {
      this.#tail = null;
    }
    // move head to next item
    this.#head = item.next;
    if (this.#head) {
      this.#head.prev = null;
    }
    return item.data;
  }

  pop() {
    const item = this.#tail;
    if (item === null) {
      return null;
    }
    // reset head if list has only one item
    if (this.#head === this.#tail) {
      this.#head = null;
    }
    // move tail to prev item
    this.#tail = item.prev;
    if (this.#tail) {
      this.#tail.next = null;
    }
    return item.data;
  }

  * values(reverse: boolean = false): Iterator<T> {
    let item = reverse ? this.#tail : this.#head;
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
