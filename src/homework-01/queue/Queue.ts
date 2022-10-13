export default interface Queue<T> {
  head: T | null;
  push(data: T): this;
  pop(): T;
  flush(): void;
}
