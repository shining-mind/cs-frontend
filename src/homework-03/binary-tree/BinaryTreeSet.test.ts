/* eslint-disable no-nested-ternary */
import BinaryTreeSet from './BinaryTreeSet';

const numberComparator = (a: number, b: number) => (a === b ? 0 : (a > b ? 1 : -1));

describe('BinaryTreeSet', () => {
  test('should add items correctly', () => {
    const tree = new BinaryTreeSet<number>([], numberComparator);
    tree.add(3)
      .add(2)
      .add(1)
      .add(4)
      .add(5);
    expect(Array.from(tree)).toEqual([3, 2, 4, 1, 5]);
  });

  test('should delete items correctly', () => {
    const tree = new BinaryTreeSet<number>([], numberComparator);
    tree.add(3)
      .add(1)
      .add(-1)
      .add(0)
      .add(5)
      .add(4)
      .add(7);
    //     3
    //    / \
    //   1   5
    //  /   / \
    // -1  4   7
    //   \
    //    0
    expect(Array.from(tree)).toEqual([3, 1, 5, -1, 4, 7, 0]);
    expect(tree.delete(5)).toEqual(true);
    //     3
    //    / \
    //   1   7
    //  /   /
    // -1  4
    //   \
    //    0
    expect(Array.from(tree)).toEqual([3, 1, 7, -1, 4, 0]);
    tree.add(-2);
    //      3
    //     / \
    //    1   7
    //   /   /
    //  -1  4
    //  / \
    // -2  0
    expect(Array.from(tree)).toEqual([3, 1, 7, -1, 4, -2, 0]);
    expect(tree.delete(-1)).toEqual(true);
    //       3
    //      / \
    //     1   7
    //    /   /
    //   0  4
    //  /
    // -2
    expect(Array.from(tree)).toEqual([3, 1, 7, 0, 4, -2]);
  });

  test('should find item by value', () => {
    const tree = new BinaryTreeSet([-432, 0, 1, 1, 2, 2, 2, 3, 4, 5, 6, 98], numberComparator);
    expect(tree.has(53)).toBeFalsy();
    expect(tree.has(98)).toBeTruthy();
  });
});
