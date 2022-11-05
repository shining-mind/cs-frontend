/* eslint-disable @typescript-eslint/no-throw-literal */
type ResultInput<T, E extends Error | undefined> = T | Result<T, E>;

export default class Result<T, Err extends Error | undefined = undefined> {
  #data?: T;

  #error?: Err;

  get data(): T | undefined {
    if (this.#error !== undefined) {
      throw this.#error;
    }
    return this.#data;
  }

  get error(): Err | undefined {
    return this.#error;
  }

  constructor(getInput: () => T) {
    try {
      this.#data = getInput();
    } catch (err) {
      this.#error = (err instanceof Error ? err : new Error(String(err))) as Err;
    }
  }

  static ok<U>(data: U): Result<U> {
    return new Result(() => data);
  }

  static error(error: unknown): Result<undefined, Error> {
    return new Result(() => {
      throw error;
    });
  }

  then<U>(cb: (data: T) => ResultInput<U, Err>): Result<U | undefined, Err> {
    return new Result(() => {
      if (this.#error !== undefined) {
        throw this.#error;
      }
      return Result.unwrap(cb(this.#data!));
    });
  }

  catch<U>(cb: (error: Err) => ResultInput<U, Err>): Result<U | T | undefined, Err> {
    return new Result(() => {
      if (this.#error !== undefined) {
        return Result.unwrap(cb(this.#error));
      }
      return this.#data;
    });
  }

  map<R>(cb: (data: T) => R): Result<R, Err> {
    return new Result(() => {
      if (this.#error !== undefined) {
        throw this.#error;
      }
      return cb(this.#data!);
    });
  }

  /**
   * a.k.a flatMap
   * @param cb
   * @returns
   */
  bind<U, E extends Error | undefined>(
    cb: (data: T) => ResultInput<U, E>,
  ): Result<U, E> {
    return new Result(() => {
      if (this.#error !== undefined) {
        throw this.#error;
      }
      if (this.#data !== undefined) {
        return Result.unwrap(cb(this.#data));
      }
      throw new Error('Data is undefined');
    });
  }

  static unwrap<U, E extends Error | undefined>(result: ResultInput<U, E>): U {
    if (result instanceof Result) {
      if (result.error !== undefined) {
        throw result.error;
      }
      if (result.data !== undefined) {
        return result.data;
      }
      throw new Error('Data is undefined');
    }
    return result;
  }
}
