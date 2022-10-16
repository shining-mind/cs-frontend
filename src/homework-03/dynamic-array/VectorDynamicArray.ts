import DynamicArray from './DynamicArray';

export default class VectorDynamicArray<T> implements DynamicArray<T>, Iterable<T> {
  #capacity: number;

  #length: number = 0;

  protected buffer: Array<T>;

  constructor(capacity: number) {
    this.#capacity = capacity;
    this.buffer = new Array<T>(capacity);
  }

  get length() {
    return this.#length;
  }

  add(data: T): void {
    if (this.length >= this.#capacity) {
      this.grow();
    }
    this.buffer[this.#length] = data;
    this.#length += 1;
  }

  get(index: number): T | undefined {
    return this.buffer[index];
  }

  * [Symbol.iterator](): Iterator<T> {
    yield* VectorDynamicArray.filterValues(this.buffer.values());
  }

  static* filterValues<T>(iter: IterableIterator<T>) {
    for (const value of iter) {
      if (value === undefined) {
        break;
      }
      yield value;
    }
  }

  protected grow() {
    const currentBuffer = this.buffer;
    this.buffer = new Array<T>(this.#capacity *= 2);
    this.buffer.splice(0, currentBuffer.length, ...currentBuffer);
  }
}
