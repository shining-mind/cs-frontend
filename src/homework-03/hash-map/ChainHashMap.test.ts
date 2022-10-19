import ChainHashMap from './ChainHashMap';

describe('ChainHashMap', () => {
  test('should set items', () => {
    const map = new ChainHashMap(2);
    map.set('foo', 'bar');
    map.set(10, 'bla');
    expect(map.get('foo')).toEqual('bar');
    expect(map.get(10)).toEqual('bla');
  });

  test('should handle collissions', () => {
    const map = new ChainHashMap(2);
    map.set('foo', 'bar');
    map.set(10, 'bla'); // 10 => 529 % 2 === 1
    map.set(1, 'baz'); // 1 => 49 % 2 === 1
    expect(map.get('foo')).toEqual('bar');
    expect(map.get(10)).toEqual('bla');
    expect(map.get(1)).toEqual('baz');
  });

  test('should delete items with collision starting from head', () => {
    const map = new ChainHashMap(2);
    map.set(10, 'bla'); // 10 => 529 % 2 === 1
    map.set(1, 'baz'); // 1 => 49 % 2 === 1
    expect(map.delete(10)).toBeTruthy();
    expect(map.has(10)).toBeFalsy();
    expect(map.delete(1)).toBeTruthy();
    expect(map.has(1)).toBeFalsy();
    expect(Array.from(map.values())).toEqual([]);
  });

  test('should delete items with collision starting from tail', () => {
    const map = new ChainHashMap(2);
    map.set(10, 'bla'); // 10 => 529 % 2 === 1
    map.set(1, 'baz'); // 1 => 49 % 2 === 1
    expect(map.delete(1)).toBeTruthy();
    expect(map.has(1)).toBeFalsy();
    expect(map.delete(10)).toBeTruthy();
    expect(map.has(10)).toBeFalsy();
    expect(Array.from(map.values())).toEqual([]);
  });

  test('should not create new item for same key', () => {
    const map = new ChainHashMap(2);
    map.set('foo', 'bar');
    map.set('foo', 'bar');
    expect(map.size).toEqual(1);
  });

  test('should rehash to next prime number when size >= capacity * 2', () => {
    const map = new ChainHashMap(2);
    expect(map.capacity).toEqual(2);
    map.set('foo', 'bar');
    map.set(1, 'foo');
    map.set(2, 'bar');
    map.set(3, 'baz');
    expect(map.size).toEqual(4);
    map.set(4, 'foobaz');
    expect(map.capacity).toEqual(5);
    expect(map.size).toEqual(5);
    expect(map.get('foo')).toEqual('bar');
    expect(map.get(1)).toEqual('foo');
    expect(map.get(2)).toEqual('bar');
    expect(map.get(3)).toEqual('baz');
    expect(map.get(4)).toEqual('foobaz');
  });

  describe('iterators', () => {
    const map = new ChainHashMap(2);
    map.set('foo', 'bar');
    map.set(1, 'foo');

    test('should iterate keys', () => {
      const keys = Array.from(map.keys()).sort();
      expect(keys).toEqual(['1', 'foo']);
    });

    test('should iterate values', () => {
      const values = Array.from(map.values()).sort();
      expect(values).toEqual(['bar', 'foo']);
    });

    test('should iterate entries', () => {
      const entries = Array.from(map.entries()).sort((a, b) => {
        if (a[0] === b[0]) {
          return 0;
        }
        return a[0] > b[0] ? 1 : -1;
      });
      expect(entries).toEqual([['1', 'foo'], ['foo', 'bar']]);
    });
  });
});
