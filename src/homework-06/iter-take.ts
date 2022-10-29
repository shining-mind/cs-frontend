export default function iterTake<T>(
  iterable: Iterable<T>,
  limit: number,
): IterableIterator<T> {
  const it = iterable[Symbol.iterator]();
  let i = 1;
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      if (i > limit) {
        return { value: undefined, done: true };
      }
      i += 1;
      return it.next();
    },
  };
}
