export function filter<T>(
  iterable: AsyncIterable<T>,
  predicate: (item: T) => boolean,
): AsyncIterableIterator<T> {
  const it = iterable[Symbol.asyncIterator]();
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    next() {
      const promise = it.next();
      return promise.then(({ value, done }) => {
        if (done) {
          return { value: undefined, done };
        }
        if (predicate(value)) {
          return { value, done };
        }
        return new Promise((resolve) => {
          // Prevent stack overflow
          queueMicrotask(() => {
            resolve(this.next());
          });
        });
      });
    },
  };
}

export function map<T, R>(
  iterable: AsyncIterable<T>,
  mapFn: (item: T) => R,
): AsyncIterableIterator<R> {
  const it = iterable[Symbol.asyncIterator]();
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    next() {
      const promise = it.next();
      return promise.then(({ value, done }) => {
        if (done) {
          return { value: undefined, done };
        }
        return { value: mapFn(value), done };
      });
    },
  };
}
