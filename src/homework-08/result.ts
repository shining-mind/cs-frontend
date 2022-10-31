/* eslint-disable @typescript-eslint/no-throw-literal */
type Data<T> = T | Result<T>;

export default class Result<T, Err = unknown> {
  #data?: T;

  #error?: Err;

  constructor(getData: () => Data<T>) {
    try {
      const data = getData();
      if (data instanceof Result) {
        data
          .then((value) => {
            this.#data = value;
          })
          .catch((error) => {
            this.#error = error as Err; // FIXME
          });
      } else {
        this.#data = data;
      }
    } catch (err) {
      this.#error = err as Err; // FIXME
    }
  }

  static ok<T>(data: T): Result<T> {
    return new Result(() => data);
  }

  static error<E>(error: E): Result<undefined, E> {
    return new Result(() => {
      throw error;
    });
  }

  catch(cb: (error: Err) => void): Result<T, Err> {
    return new Result(() => {
      if (this.#error !== undefined) {
        cb(this.#error);
        throw this.#error;
      }
      if (this.#data === undefined) {
        throw new Error('No data');
      }
      return this.#data;
    });
  }

  then(cb: (data: T) => void): Result<T, Err> {
    return new Result(() => {
      if (this.#data !== undefined) {
        cb(this.#data);
        return this.#data;
      }
      throw this.#error;
    });
  }

  map(cb: (data: T) => T): Result<T> {
    return new Result(() => {
      if (this.#error !== undefined) {
        throw this.#error;
      }
      if (this.#data === undefined) {
        throw new Error('No data');
      }
      return cb(this.#data);
    });
  }

  /**
   * a.k.a flatMap
   * @param cb
   * @returns
   */
  bind<B, E>(cb: (data: T) => Result<B, E>): Result<B, E> {
    if (this.#error !== undefined || this.#data === undefined) {
      return new Result(() => {
        throw this.#error ?? new Error('No data');
      });
    }
    return cb(this.#data);
  }
}
