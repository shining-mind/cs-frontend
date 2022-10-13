export default interface Structure {
  set<T = unknown>(key: string, value: T): this;
  get<T = unknown>(key: string): T;
}
