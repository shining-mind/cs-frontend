import ConcreteQueue from './ConcreteQueue';
import DoubleEndedQueue from './DoubleEndedQueue';

export default class ConcreteDoubleEndedQueue<T>
  extends ConcreteQueue<T>
  implements DoubleEndedQueue<T> {
  get tail(): T | null {
    return this.list.tail?.data || null;
  }

  unshift(data: T): this {
    this.list.unshift(data);
    return this;
  }

  shift(): T {
    const data = this.list.shift();
    if (data === null) {
      throw new Error('Empty queue');
    }
    return data;
  }

  pop(): T {
    const data = this.list.pop();
    if (data === null) {
      throw new Error('Empty queue');
    }
    return data;
  }
}
