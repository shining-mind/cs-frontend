import Result from './result';

// TODO: fix type infer
// type GeneratorValue<T extends Result<any, any>> = T extends Result<infer V> ? V : unknown;
// type GeneratorError<T extends Result<any, any>> = T extends Result<any, infer E> ? E : unknown;

export default function exec(
  // FIXME: выводить типы через infer *боль 😩😓*
  generator: () => Generator<Result<any, any>, any, any>,
): void {
  const it = generator();
  const run = (count: number, result: any) => {
    const { value: promise, done } = it.next(result);
    if (done) {
      return;
    }
    promise
      .then((data) => {
        // Prevent stack overflow
        if (count > 1e3) {
          queueMicrotask(() => run(0, data));
        } else {
          run(count + 1, data);
        }
      })
      .catch((error) => {
        it.throw(error);
      });
  };
  run(0, undefined);
}
