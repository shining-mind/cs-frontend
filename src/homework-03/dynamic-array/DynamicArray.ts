export default interface DynamicArray<T> {
  length: number;
  add(data: T): void;
  get(index: number): T | undefined;
}
