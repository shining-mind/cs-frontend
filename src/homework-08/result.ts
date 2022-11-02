/* eslint-disable @typescript-eslint/no-throw-literal */
type ResultInput<T, E extends Error | undefined> = T | Result<T, E>;

export default class Result<T, Err extends Error | undefined = undefined> {
  #data?: T;

  #error?: Err;

  constructor(getInput: () => ResultInput<T | undefined, Err>) {
    try {
      const input = getInput();
      if (input instanceof Result) {
        input
          .then((value) => {
            this.#data = value;
          })
          .catch((error) => {
            this.#error = error;
          });
      } else {
        this.#data = input;
      }
    } catch (err) {
      this.#error = (err instanceof Error ? err : new Error(String(err))) as Err;
    }
  }

  static ok<T>(data: T): Result<T> {
    return new Result(() => data);
  }

  static error(error: unknown): Result<undefined, Error> {
    return new Result(() => {
      throw error;
    });
  }

  catch<R>(cb: (error: Err) => ResultInput<R, Err>): Result<R | T, Err> {
    return new Result(() => {
      if (this.#error !== undefined) {
        return cb(this.#error);
      }
      return this.#data!;
    });
  }

  then<R>(cb: (data?: T) => ResultInput<R, Err>): Result<R, Err> {
    return new Result(() => {
      if (this.#error !== undefined) {
        throw this.#error;
      }
      return cb(this.#data);
    });
  }

  map(cb: (data: T) => T): Result<T> {
    return new Result(() => {
      if (this.#error !== undefined) {
        throw this.#error;
      }
      if (this.#data !== undefined) {
        return cb(this.#data);
      }
      return this.#data;
    });
  }

  /**
   * a.k.a flatMap
   * @param cb
   * @returns
   */
  bind<B, E extends Error | undefined>(cb: (data: T) => ResultInput<B, E>): Result<B | T, E> {
    return new Result(() => {
      if (this.#error !== undefined) {
        throw this.#error;
      }
      if (this.#data !== undefined) {
        return cb(this.#data);
      }
      return this.#data!;
    });
  }
}
