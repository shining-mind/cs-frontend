import primeGenerator from '../utils/prime-generator';

interface ChainHashMapNode<T> {
  value: T;
  key: string;
  next: ChainHashMapNode<T> | null;
}

export default class ChainHashMap<T> implements Map<string, T> {
  [Symbol.toStringTag]: string = '[object ChainHashMap]';

  protected buffer: Array<ChainHashMapNode<T> | undefined>;

  protected primeIterator: Iterator<number>;

  #size: number = 0;

  #capacity: number = 0;

  #initialCapacity: number | undefined = 0;

  get capacity() {
    return this.#capacity;
  }

  get size() {
    return this.#size;
  }

  constructor(initialCapacity?: number) {
    this.#initialCapacity = initialCapacity;
    this.primeIterator = primeGenerator(initialCapacity);
    this.#capacity = this.primeIterator.next().value;
    this.buffer = new Array<ChainHashMapNode<T>>(this.#capacity);
  }

  clear(): void {
    this.primeIterator = primeGenerator(this.#initialCapacity);
    this.#capacity = this.primeIterator.next().value;
    this.buffer = new Array<ChainHashMapNode<T>>(this.#capacity);
  }

  delete(key: unknown): boolean {
    const keyStringified = String(key);
    const pos = this.hashKey(keyStringified);
    const node = this.buffer[pos];
    if (node) {
      let item: ChainHashMapNode<T> | null = node;
      let prev = node;
      while (item !== null) {
        if (item.key === keyStringified) {
          prev.next = item.next;
          this.#size -= 1;
          // Delete from buffer if it's first item in the list
          if (item === node) {
            this.buffer[pos] = item.next ?? undefined;
          }
          return true;
        }
        prev = item;
        item = item.next;
      }
    }
    return false;
  }

  forEach(callbackfn: (value: T, key: string, map: Map<string, T>) => void, thisArg?: any): void {
    for (const [key, value] of this.entries()) {
      callbackfn.call(thisArg || this, value, key, this);
    }
  }

  get(key: unknown): T | undefined {
    const node = this.buffer[this.hashKey(key)];
    let found = null;
    if (node) {
      found = ChainHashMap.findNode(key, node);
    }
    return found?.value;
  }

  has(key: unknown): boolean {
    const node = this.buffer[this.hashKey(key)];
    return node !== undefined && ChainHashMap.findNode(key, node) !== null;
  }

  set(key: unknown, value: T): this {
    if (this.#size >= this.#capacity * 2) {
      this.rehash();
    }
    const keyStringified = String(key);
    const pos = this.hashKey(keyStringified);
    const node = this.buffer[pos];
    const newNode = { value, key: keyStringified, next: null };
    if (!node) {
      this.buffer[pos] = newNode;
      this.#size += 1;
    } else {
      const nextNode = ChainHashMap.findNextNode(keyStringified, node);
      if (nextNode.key !== keyStringified) {
        nextNode.next = newNode;
        this.#size += 1;
      }
    }
    return this;
  }

  * entries(): Generator<[string, T]> {
    for (let i = 0; i < this.buffer.length; i += 1) {
      let node = this.buffer[i] || null;
      while (node !== null) {
        yield [node.key, node.value];
        node = node.next;
      }
    }
  }

  * keys(): Generator<string> {
    for (const [key] of this.entries()) {
      yield key;
    }
  }

  * values(): Generator<T> {
    for (const [, value] of this.entries()) {
      yield value;
    }
  }

  [Symbol.iterator](): IterableIterator<[string, T]> {
    return this.entries();
  }

  /**
   * Returns node with matching key or node for insertion
   * @param key
   * @param startNode
   * @returns
   */
  static findNextNode<T>(key: unknown, startNode: ChainHashMapNode<T>): ChainHashMapNode<T> {
    const keyStringified = String(key);
    let item = startNode;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (item.key === keyStringified || item.next === null) {
        return item;
      }
      item = item.next;
    }
  }

  static findNode<T>(key: unknown, startNode: ChainHashMapNode<T>): ChainHashMapNode<T> | null {
    const keyStringified = String(key);
    let item: ChainHashMapNode<T> | null = startNode;
    while (item !== null) {
      if (item.key === keyStringified) {
        return item;
      }
      item = item.next;
    }
    return null;
  }

  protected rehash() {
    let newCapacity = this.#capacity;
    while (newCapacity < this.#capacity * 2) {
      newCapacity = this.primeIterator.next().value;
    }
    const entries = Array.from(this.entries());
    this.#capacity = newCapacity;
    this.buffer = new Array<ChainHashMapNode<T>>(this.#capacity);
    this.#size = 0;
    for (const [key, value] of entries) {
      this.set(key, value);
    }
  }

  protected hashKey(key: unknown): number {
    const keyStringified = String(key);
    const value = [...keyStringified]
      .reduce((acc, char, i) => acc + ((char.codePointAt(0) || 0) * 10 ** i), 0);
    return value % this.#capacity;
  }
}
