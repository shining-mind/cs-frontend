import ConcreteQueue from '../../homework-01/queue/ConcreteQueue';

interface BinaryTreeSetNode<T> {
  value: T;
  left: BinaryTreeSetNode<T> | null;
  right: BinaryTreeSetNode<T> | null;
}

type BinaryTreeSetComparator<T> = (a: T, b: T) => number;

export default class BinaryTreeSet<T> implements Set<T> {
  #root: BinaryTreeSetNode<T> | null = null;

  #size: number = 0;

  #compare: BinaryTreeSetComparator<T>;

  /**
   * @param values Iterable
   * @param comparator Returns 1 if a > b, -1 if a < b, 0 if a = b
   */
  constructor(values: Iterable<T>, comparator: BinaryTreeSetComparator<T>) {
    this.#compare = comparator;
    for (const value of values) {
      this.add(value);
    }
  }

  get size() {
    return this.#size;
  }

  add(value: T): this {
    if (this.#root === null) {
      this.#root = BinaryTreeSet.createLeaf(value);
    } else {
      const { node, diff } = this.findNodeForValue(value);
      // NOTE: ignore existing node
      if (diff === 1) {
        node.left = BinaryTreeSet.createLeaf(value);
      } else if (diff === -1) {
        node.right = BinaryTreeSet.createLeaf(value);
      }
    }
    return this;
  }

  clear(): void {
    this.#root = null;
  }

  delete(value: T): boolean {
    if (this.#root === null) {
      return false;
    }
    const { node, parent, diff } = this.findNodeForValue(value);
    if (diff !== 0) {
      return false;
    }
    if (parent === null) {
      this.clear();
      return true;
    }
    if (node.right && node.left) {
      const {
        node: childNode, diff: childDiff,
      } = this.findNodeForValue(node.left.value, node.right);
      if (childDiff === 1) {
        childNode.left = node.left;
      } else if (childDiff === -1) {
        childNode.right = node.left;
      }
    }

    if (parent.left === node) {
      parent.left = node.right ?? node.left;
    } else if (parent.right === node) {
      parent.right = node.right ?? node.left;
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: unknown): void {
    for (const [v1, v2] of this.entries()) {
      callbackfn(v1, v2, this);
    }
  }

  has(value: T): boolean {
    const { diff } = this.findNodeForValue(value);
    return diff === 0;
  }

  * entries(): Generator<[T, T]> {
    for (const v of this.values()) {
      yield [v, v];
    }
  }

  keys(): Generator<T> {
    return this.values();
  }

  /**
   * Default iterator uses breadth first algorithm
   */
  * values(): Generator<T> {
    const queue = new ConcreteQueue<BinaryTreeSetNode<T>>();
    let node = this.#root;
    while (node !== null) {
      yield node?.value;
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
      node = queue.pop();
    }
  }

  [Symbol.iterator](): Generator<T> {
    return this.values();
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag](): string {
    return '[object BinaryTreeSet]';
  }

  /**
   * @param value
   *
   * @returns [node, comparison result]
   */
  protected findNodeForValue(value: T, startNode = this.#root): {
    node: BinaryTreeSetNode<T>, parent: BinaryTreeSetNode<T> | null, diff: number
  } {
    if (startNode === null) {
      throw new TypeError('Invalid starting node provided in findNodeForValue');
    }
    let node = startNode;
    let parent: BinaryTreeSetNode<T> | null = null;
    let foundNode = false;
    let diff = 0;
    while (!foundNode) {
      diff = this.#compare(node.value, value);
      foundNode = (diff === 1 && !node.left) || (diff === -1 && !node.right) || diff === 0;
      if (diff === 1) {
        parent = node.left ? node : parent;
        node = node.left ?? node;
      } else if (diff === -1) {
        parent = node.right ? node : parent;
        node = node.right ?? node;
      }
    }
    return { node, parent, diff };
  }

  protected static createLeaf<T>(value: T): BinaryTreeSetNode<T> {
    return { value, left: null, right: null };
  }
}
