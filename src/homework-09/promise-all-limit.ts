type AsyncFunction = () => Promise<unknown>;

type SyncFunction = () => unknown;

type ResultValue<T extends AsyncFunction | SyncFunction>
  = T extends () => Promise<infer V> ? V : (T extends () => infer U ? U : unknown);

export default function promiseAllLimit<T extends AsyncFunction | SyncFunction>(
  functions: Iterable<T>,
  max: number,
): Promise<Array<ResultValue<T>>> {
  const it = functions[Symbol.iterator]();
  const results: Array<ResultValue<T>> = [];
  let pending = 0;
  return new Promise((resolve, reject) => {
    const nextPromise = () => {
      const { value: fn, done } = it.next();
      // Start next promise
      if (!done) {
        // Prepare result index with undefined value
        const resultIndex = results.push(undefined as ResultValue<T>) - 1;
        pending += 1;
        Promise.resolve(fn())
          .then((value) => {
            results[resultIndex] = value as ResultValue<T>;
            pending -= 1;
            if (pending < max) {
              nextPromise();
            }
          })
          // Reject on error same as in Promise.all()
          .catch(reject);
      // Wait until all promises settle
      } else if (pending === 0) {
        resolve(results);
      }
    };
    // Fill "queue" with pending promises
    while (pending < max) {
      nextPromise();
    }
  });
}
