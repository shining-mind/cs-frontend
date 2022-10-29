export default function iterSeq(...iterables: Iterable<any>[]): IterableIterator<any> {
  let i = 0;
  let it: Iterator<any> = iterables.length > 0
    ? iterables[i][Symbol.iterator]()
    : { next: () => ({ value: undefined, done: true }) };
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      const { value, done } = it.next();
      if (done) {
        i += 1;
        if (i >= iterables.length) {
          return { value: undefined, done: true };
        }
        it = iterables[i][Symbol.iterator]();
        return this.next();
      }
      return { value, done: false };
    },
  };
}
