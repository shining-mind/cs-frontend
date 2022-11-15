type ThunkFunction<T> = (err: unknown | null, result: T) => void;

function promisify<TResult>(
  fn: (cb: ThunkFunction<TResult>) => void
): () => Promise<TResult>;
function promisify<T1, TResult>(
  fn: (arg1: T1, cb: ThunkFunction<TResult>) => void
): (arg1: T1) => Promise<TResult>;
function promisify<T1, T2, TResult>(
  fn: (arg1: T1, arg2: T2, cb: ThunkFunction<TResult>) => void
): (arg1: T1, arg2: T2) => Promise<TResult>;
function promisify<T1, T2, T3, TResult>(
  fn: (arg1: T1, arg2: T2, arg3: T3, cb: ThunkFunction<TResult>
  ) => void): (arg1: T1, arg2: T2, arg3: T3) => Promise<TResult>;
function promisify<T1, T2, T3, T4, TResult>(
  fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, cb: ThunkFunction<TResult>) => void
): (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => Promise<TResult>;
function promisify<T1, T2, T3, T4, T5, TResult>(
  fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, cb: ThunkFunction<TResult>) => void,
): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5) => Promise<TResult>;
function promisify<T1, T2, T3, T4, T5, TResult>(
  fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, cb: ThunkFunction<TResult>) => void,
): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5) => Promise<TResult> {
  return (...args) => new Promise((resolve, reject) => {
    fn(...args, (error, result) => {
      if (error !== null) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

export default promisify;
