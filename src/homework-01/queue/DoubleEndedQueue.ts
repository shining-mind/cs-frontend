import Queue from './Queue';

export default interface DoubleEndedQueue<T> extends Queue<T> {
  tail: T | null;
  unshift(data: T): this;
  shift(): T | null;
}
