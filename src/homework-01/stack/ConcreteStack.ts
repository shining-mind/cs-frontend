import Stack from './Stack';

export default class ConcreteStack<T> implements Stack<T> {
  #list: Array<T> = [];

  get head(): T | null {
    return this.#list[this.#list.length - 1] || null;
  }

  pop(): T {
    const data = this.#list.pop();
    if (data === undefined) {
      throw new Error('Stack empty');
    }
    return data;
  }

  push(data: T): this {
    this.#list.push(data);

    return this;
  }
}
