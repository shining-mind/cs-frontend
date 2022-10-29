export default function iterEnumerate<T>(iterable: Iterable<T>): IterableIterator<[number, T]> {
  const it = iterable[Symbol.iterator]();
  let i = -1;
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      const { value, done } = it.next();
      if (done) {
        return { value: undefined, done };
      }
      i += 1;
      return { value: [i, value], done };
    },
  };
}
