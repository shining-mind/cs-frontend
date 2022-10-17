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

  test('should delete items correctly #1', () => {
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

  test('should delete items correctly #2', () => {
    const tree = new BinaryTreeSet<number>([7, 5, 2, 3, 4, 1], numberComparator);
    expect(Array.from(tree)).toEqual([7, 5, 2, 1, 3, 4]);
    expect(tree.delete(2)).toEqual(true);
    expect(Array.from(tree)).toEqual([7, 5, 3, 1, 4]);
  });

  test('should find item by value', () => {
    const tree = new BinaryTreeSet([-432, 0, 1, 1, 2, 2, 2, 3, 4, 5, 6, 98], numberComparator);
    expect(tree.has(53)).toBeFalsy();
    expect(tree.has(98)).toBeTruthy();
  });

  test('callback in forEach should be bound to binary tree by default', () => {
    const tree = new BinaryTreeSet([1], numberComparator);
    tree.forEach(function testForEach(value, value2, set) {
      expect(value).toEqual(1);
      expect(value2).toEqual(1);
      expect(set).toEqual(tree);
      // @ts-ignore
      expect(this).toEqual(tree);
    });
  });

  test('callback in forEach should be bound to passed argument', () => {
    const tree = new BinaryTreeSet([1], numberComparator);
    const context = {};
    tree.forEach(function testForEach(value, value2, set) {
      expect(value).toEqual(1);
      expect(value2).toEqual(1);
      expect(set).toEqual(tree);
      // @ts-ignore
      expect(this).toEqual(context);
    }, context);
  });
});
