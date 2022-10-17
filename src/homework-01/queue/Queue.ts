export default interface Queue<T> {
  head: T | null;
  push(data: T): this;
  pop(): T | null;
  flush(): void;
}
