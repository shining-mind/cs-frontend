export default interface DynamicArray<T> {
  length: number;
  add(data: T): void;
  get(index: number): T | undefined;
  splice(start: number, deleteCount: number, ...items: T[]): T[];
}
