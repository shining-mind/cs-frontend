function isPromiseLike<T>(data: T | PromiseLike<T>): data is PromiseLike<T> {
  return typeof data === 'object' && data !== null && (data as PromiseLike<T>).then !== undefined;
}

type PromiseInput<T> = T | PromiseLike<T>;

type ResolveFunction<T> = (data: PromiseInput<T>) => void;

type RejectFunction = (reason: any) => void;

type Onfulfilled<T, TResult> = (value: T) => TResult | PromiseLike<TResult>;

type Onrejected<TResult> = (reason: any) => TResult | PromiseLike<TResult>;

enum SyncPromiseState {
  Pending,
  Fulfilled,
  Rejected,
}

function safeCall(fn: Function, reject: RejectFunction) {
  try {
    fn();
  } catch (error) {
    reject(error);
  }
}

function cast<T>(value: any): T {
  return value;
}

export default class SyncPromise<T> implements Promise<T> {
  #state: SyncPromiseState = SyncPromiseState.Pending;

  #data?: T;

  #reason?: any;

  #fulfilledHandlers: Onfulfilled<T, unknown>[] = [];

  #rejectedHandlers: Onrejected<unknown>[] = [];

  constructor(executor: (resolve: ResolveFunction<T>, reject: RejectFunction) => void) {
    const resolve: ResolveFunction<T> = (data) => {
      if (isPromiseLike(data)) {
        data.then(this.#setData.bind(this));
      } else {
        this.#setData(data);
      }
    };
    const reject: RejectFunction = (reason) => {
      this.#setReason(reason);
    };
    safeCall(() => executor(resolve, reject), reject);
  }

  #setData(data: T): void {
    if (this.#state === SyncPromiseState.Pending) {
      this.#data = data;
      this.#state = SyncPromiseState.Fulfilled;
      this.#fulfilledHandlers.forEach((handler) => {
        handler(this.#data!);
      });
    }
  }

  #setReason(reason: any): void {
    if (this.#state === SyncPromiseState.Pending) {
      this.#reason = reason;
      this.#state = SyncPromiseState.Rejected;
      if (this.#rejectedHandlers.length > 0) {
        this.#rejectedHandlers.forEach((handler) => {
          handler(this.#reason);
        });
      } else {
        throw this.#reason;
      }
    }
  }

  static resolve<T>(data: T | PromiseLike<T>): SyncPromise<T> {
    return new SyncPromise((resolve) => {
      resolve(data);
    });
  }

  static reject<T = never>(reason: any): SyncPromise<T> {
    return new SyncPromise(() => {
      throw reason;
    });
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: Onfulfilled<T, TResult1> | null | undefined,
    onrejected?: Onrejected<TResult2> | null | undefined,
  ): Promise<TResult1 | TResult2> {
    return new SyncPromise<TResult1 | TResult2>((resolve, reject) => {
      if (this.#state === SyncPromiseState.Fulfilled) {
        if (typeof onfulfilled === 'function') {
          safeCall(() => resolve(onfulfilled(this.#data!)), reject);
        } else {
          resolve(this.#data! as TResult1);
        }
        return;
      }
      if (this.#state === SyncPromiseState.Rejected) {
        if (typeof onrejected === 'function') {
          safeCall(() => resolve(onrejected(this.#reason)), reject);
        } else {
          reject(this.#reason!);
        }
        return;
      }
      // Pending
      if (typeof onfulfilled === 'function') {
        this.#fulfilledHandlers.push((data) => {
          safeCall(() => resolve(onfulfilled(data)), reject);
        });
      } else {
        this.#fulfilledHandlers.push((data) => {
          resolve(cast<TResult1>(data));
        });
      }
      if (typeof onrejected === 'function') {
        this.#rejectedHandlers.push((reason) => {
          safeCall(() => resolve(onrejected(reason)), reject);
        });
      } else {
        this.#rejectedHandlers.push((reason) => {
          reject(reason);
        });
      }
    });
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined,
  ): Promise<T | TResult> {
    return new SyncPromise((resolve, reject) => {
      if (this.#state === SyncPromiseState.Fulfilled) {
        resolve(this.#data!);
        return;
      }
      if (this.#state === SyncPromiseState.Rejected) {
        if (typeof onrejected === 'function') {
          safeCall(() => resolve(onrejected(this.#reason)), reject);
        } else {
          reject(this.#reason!);
        }
        return;
      }
      // Pending
      if (typeof onrejected === 'function') {
        this.#rejectedHandlers.push((reason) => {
          safeCall(() => resolve(onrejected(reason)), reject);
        });
      }
      this.#fulfilledHandlers.push((data) => {
        resolve(data);
      });
    });
  }

  finally(onfinally?: (() => void) | null | undefined): Promise<T> {
    throw new Error('Method not implemented.');
  }

  [Symbol.toStringTag]: string = '[object SyncPromise]';
}
