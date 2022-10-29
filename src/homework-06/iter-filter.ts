export default function iterFilter<T>(
  iterable: Iterable<T>,
  predicate: (item: T) => boolean,
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
      if (predicate(value)) {
        return { value, done };
      }
      return this.next();
    },
  };
}
