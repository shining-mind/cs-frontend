/* eslint-disable no-plusplus */
export default class IterRange<T extends string | number> {
  #isChar = false;

  #from: number = 0;

  #to: number = 0;

  constructor(from: T, to: T) {
    if (typeof from !== typeof to) {
      throw new TypeError('Types should be equal');
    }
    if (from === '' || to === '') {
      throw new TypeError('Strings should not be empty');
    }
    this.#isChar = typeof from === 'string';
    this.#from = typeof from === 'string' ? from.codePointAt(0)! : from;
    this.#to = typeof to === 'string' ? to.codePointAt(0)! : to;
  }

  [Symbol.iterator](): Iterator<T extends string ? string : number> {
    let from = this.#from;
    return {
      next: () => {
        if (from > this.#to) {
          return { value: undefined, done: true };
        }
        return {
          value: (this.#isChar ? String.fromCodePoint(from++) : from++) as any,
          done: false,
        };
      },
    };
  }

  reverse(): IterableIterator<T extends string ? string : number> {
    let to = this.#to;
    return {
      [Symbol.iterator]() {
        return this;
      },
      next: () => {
        if (this.#from > to) {
          return { value: undefined, done: true };
        }
        return {
          value: (this.#isChar ? String.fromCodePoint(to--) : to--) as any,
          done: false,
        };
      },
    };
  }
}
