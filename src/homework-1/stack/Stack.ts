export default interface Stack<T> {
  head: T | null;
  pop(): T;
  push(data: T): this;
}
