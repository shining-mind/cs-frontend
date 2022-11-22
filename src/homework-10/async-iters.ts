type AsyncIterableValue<T extends AsyncIterable<any>[]> = T extends AsyncIterable<infer V>[]
  ? V : unknown;

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

export function seq<T extends AsyncIterable<any>[]>(
  ...iterables: T
): AsyncIterableIterator<AsyncIterableValue<T>> {
  let i = 0;
  let it: AsyncIterator<any> = iterables.length > 0
    ? iterables[i][Symbol.asyncIterator]()
    : { next: () => (Promise.resolve({ value: undefined, done: true })) };
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    next() {
      const promise = it.next();
      return promise.then(({ value, done }) => {
        if (done) {
          i += 1;
          if (i >= iterables.length) {
            return { value: undefined, done: true };
          }
          it = iterables[i][Symbol.asyncIterator]();
          return this.next();
        }
        return { value, done: false };
      });
    },
  };
}
export async function* take<T>(
  iterable: AsyncIterable<T>,
  limit: number,
): AsyncGenerator<T> {
  let i = 1;
  for await (const value of iterable) {
    yield value;
    i += 1;
    if (i > limit) {
      break;
    }
  }
}
