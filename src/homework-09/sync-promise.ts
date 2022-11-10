/* eslint-disable */

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
  Rejected
}

export class SyncPromise<T> implements Promise<T> {
  #state: SyncPromiseState = SyncPromiseState.Pending;

  #data?: T;

  #reason?: any;

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
    try {
      executor(resolve, reject);
    } catch (error) {
      this.#setReason(error);
    }
  }

  #setData(data: T): void {
    if (this.#state === SyncPromiseState.Pending) {
      this.#data = data;
      this.#state = SyncPromiseState.Fulfilled;
    }
  }

  #setReason(reason: any): void {
    if (this.#state === SyncPromiseState.Pending) {
      this.#reason = reason;
      this.#state = SyncPromiseState.Rejected;
      // TODO: should it throw if there is no catch or then?
    }
  }

  static resolve<T>(data: T | PromiseLike<T>): SyncPromise<T> {
    return new SyncPromise((resolve) => {
      resolve(data);
    });
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: Onfulfilled<T, TResult1> | null | undefined,
    onrejected?: Onrejected<TResult2> | null | undefined
  ): Promise<TResult1 | TResult2> {
    // Fulfilled
    if (this.#state === SyncPromiseState.Fulfilled) {
      return typeof onfulfilled === 'function'
        ? SyncPromise.resolve(onfulfilled(this.#data!))
        : SyncPromise.resolve(this.#data! as TResult1);
    }
    // Rejected
    if (this.#state === SyncPromiseState.Rejected) {
      if (typeof onrejected === 'function') {
        return SyncPromise.resolve(onrejected(this.#reason));
      }
      throw this.#reason!;
    }
    // Pending
    return new SyncPromise<TResult1 | TResult2>((resolve, reject) => {
      if (typeof onfulfilled === 'function') {
          resolve(this.then(onfulfilled));
      }
      if (typeof onrejected === 'function') {
        setTimeout(() => {
          resolve(this.catch(onrejected) as PromiseLike<TResult1 | TResult2>);
        }, 0);
      } else {
        this.catch(reject);
      }
    });
  }

  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined): Promise<T | TResult> {
    return new SyncPromise((resolve) => {
      resolve(this.catch(onrejected) as PromiseLike<T | TResult>);
    });
  }

  finally(onfinally?: (() => void) | null | undefined): Promise<T> {
    throw new Error("Method not implemented.");
  }

  [Symbol.toStringTag]: string = '[object SyncPromise]';
}
