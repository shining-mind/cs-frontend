import type { Bit, UintArray } from './types';
import skipBits from './utils/skip-bits';
import takeBits from './utils/take-bits';

type WordSize = 8 | 16 | 32;

export default class BitVector implements Iterable<Bit> {
  #capacity: number;

  #length: number = 0;

  #wordSize: WordSize;

  protected buffer: UintArray;

  constructor(capacity: number, wordSize: WordSize = 8) {
    this.#capacity = capacity;
    this.#wordSize = wordSize;
    this.buffer = this.createBuffer(capacity);
  }

  [Symbol.iterator](): IterableIterator<Bit> {
    let i = 0;
    return {
      [Symbol.iterator]() {
        return this;
      },
      next: () => {
        if (i >= this.#length) {
          return { value: undefined, done: true };
        }
        // eslint-disable-next-line no-plusplus
        return { value: this.get(i++), done: false };
      },
    };
  }

  /**
   * Available storage size
   */
  get capacity() {
    return this.#capacity;
  }

  /**
   * Bits count
   */
  get length() {
    return this.#length;
  }

  /**
   * Bytes allocated
   */
  get bytesAllocated() {
    return this.buffer.byteLength;
  }

  /**
   * Push bit to vector
   * @param value Bit value
   * @returns Bit count
   */
  push(value: Bit): number {
    if (this.length >= this.#capacity) {
      this.grow();
    }
    this.#length += 1;
    this.set(this.#length - 1, value);
    return this.#length;
  }

  /**
   * @param index Bit position
   * @param value Bit value
   */
  set(index: number, value: Bit): void {
    if (index >= this.#length) {
      throw new RangeError(`Can't set bit at position ${index}`);
    }
    const word = this.getWord(index);
    const bitMask = (1 << this.#wordSize - (index % this.#length) - 1);
    if (value === 1) {
      this.setWord(index, word | bitMask);
    } else {
      this.setWord(index, word & ((2 ** this.#wordSize - 1) ^ bitMask));
    }
  }

  /**
   * @param index Bit position
   * @returns Bit value
   */
  get(index: number): Bit {
    if (index >= this.#length) {
      throw new RangeError(`Can't get bit at position ${index}`);
    }
    const word = this.getWord(index);
    const offset = index % this.#wordSize;
    return takeBits(skipBits(word, offset, this.#wordSize), 1, this.#wordSize - offset) as Bit;
  }

  protected getWord(index: number): number {
    return this.buffer[Math.floor(index / this.#wordSize)];
  }

  protected setWord(index: number, word: number): void {
    this.buffer[Math.floor(index / this.#wordSize)] = word;
  }

  protected grow() {
    // TODO: prevent int32 overflow
    this.#capacity *= 2;
    // Grow only if allocated bits count is less than capacity
    if (this.buffer.byteLength * 8 < this.#capacity) {
      const currentBuffer = this.buffer;
      this.buffer = this.createBuffer(this.#capacity);
      this.buffer.set(currentBuffer);
    }
  }

  protected createBuffer(capacity: number): UintArray {
    const size = Math.ceil(capacity / this.#wordSize);
    switch (this.#wordSize) {
      case 8:
        return new Uint8Array(size);
      case 16:
        return new Uint16Array(size);
      case 32:
        return new Uint32Array(size);
      default:
        throw new TypeError(`Unexpected word size: ${this.#wordSize}`);
    }
  }
}