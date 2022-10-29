import IterRange from './iter-range';

describe('iterRange', () => {
  test('iterate between "a" and "f"', () => {
    const range = new IterRange('a', 'f');
    expect([...range]).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
  });

  test('iterate between -5 and 1', () => {
    const range = new IterRange(-5, 1);
    expect([...range]).toEqual([-5, -4, -3, -2, -1, 0, 1]);
  });

  test('reverse iterate between "a" and "f"', () => {
    const range = new IterRange('a', 'f');
    expect([...range.reverse()]).toEqual(['f', 'e', 'd', 'c', 'b', 'a']);
  });

  test('reverse iterate between -5 and 1', () => {
    const range = new IterRange(-5, 1);
    expect([...range.reverse()]).toEqual([1, 0, -1, -2, -3, -4, -5]);
  });
});
