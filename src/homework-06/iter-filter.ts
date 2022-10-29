export default function iterFilter<T>(
  iterable: Iterable<T>,
  filterFunc: (item: T) => boolean,
): IterableIterator<T> {
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
      if (filterFunc(value)) {
        return { value, done };
      }
      return this.next();
    },
  };
}
