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
      let allDone = true;
      for (let i = 0; i < iterators.length; i += 1) {
        const { value, done } = iterators[i].next();
        tuple[i] = value;
        allDone = allDone && done;
      }
      if (allDone) {
        return { value: undefined, done: true };
      }
      return { value: tuple, done: false };
    },
  };
}
