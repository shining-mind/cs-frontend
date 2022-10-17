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

  shift(): T | null {
    return super.pop();
  }

  pop(): T | null {
    return this.list.pop();
  }
}
