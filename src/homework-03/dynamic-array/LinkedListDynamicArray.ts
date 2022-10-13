import ConcreteDoublyLinkedList from '../../homework-01/linked-list/ConcreteDoublyLinkedList';
import DynamicArray from './DynamicArray';

export default class LinkedListDynamicArray<T> implements DynamicArray<T>, Iterable<T> {
  #length: number;

  #fixedArraySize: number;

  #list: ConcreteDoublyLinkedList<Array<T>> = new ConcreteDoublyLinkedList<Array<T>>();

  constructor(fixedArraySize: number) {
    this.#length = 0;
    this.#fixedArraySize = fixedArraySize;
  }

  get length(): number {
    return this.#length;
  }

  add(data: T): void {
    const arr = this.#list?.tail?.data;
    if (!arr || arr[arr.length - 1] !== undefined) {
      this.grow();
      this.add(data);
    } else {
      arr[this.#length % this.#fixedArraySize] = data;
      this.#length += 1;
    }
  }

  get(index: number): T | undefined {
    const array = this.findArrayForIndex(index);
    return array === null ? undefined : array[index % this.#fixedArraySize];
  }

  * [Symbol.iterator](): Iterator<T> {
    for (const arr of this.#list) {
      for (let i = 0; i < this.#fixedArraySize; i += 1) {
        yield arr[i];
      }
    }
  }

  private findArrayForIndex(index: number): Array<T> | null {
    const target = Math.floor(index / this.#fixedArraySize);
    let i = 0;
    for (const array of this.#list) {
      if (i === target) {
        return array;
      }
      i += 1;
    }
    return null;
  }

  private grow() {
    this.#list.add(new Array<T>(this.#fixedArraySize));
  }
}
