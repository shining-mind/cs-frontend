export default function iterZip(...iterables: Iterable<any>[]): IterableIterator<any> {
  const iterators = new Array(iterables.length);
  iterables.forEach((iterable, i) => {
    iterators[i] = iterable[Symbol.iterator]();
  });
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      const tuple = new Array(iterators.length);
      for (const [i, it] of iterators.entries()) {
        const { value, done } = it.next();
        if (done) {
          return { value: undefined, done: true };
        }
        tuple[i] = value;
      }
      return { value: tuple, done: false };
    },
  };
}
