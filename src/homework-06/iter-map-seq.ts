export default function iterMapSeq<T, R = T>(
  iterable: Iterable<T>,
  funcs: Iterable<(value: T | R) => R>,
): IterableIterator<T | R> {
  const it = iterable[Symbol.iterator]();
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      const { value, done } = it.next();
      if (done) {
        return { value: undefined, done };
      }
      let modifiedValue: T | R = value;
      for (const func of funcs) {
        modifiedValue = func(modifiedValue);
      }
      return { value: modifiedValue, done: false };
    },
  };
}
