export interface DoublyLinkedListItem<T> {
  data: T;
  next: DoublyLinkedListItem<T> | null;
  prev: DoublyLinkedListItem<T> | null;
}

export default interface DoublyLinkedList<T> {
  head: DoublyLinkedListItem<T> | null;
  tail: DoublyLinkedListItem<T> | null;
  add(value: T): this;
  unshift(value: T): this;
  shift(): T | null;
  pop(): T | null;
}
