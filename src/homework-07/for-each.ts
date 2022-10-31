const MAX_WORK_TIME = 50;
const PAUSE_TIME = 50;

type ForEachOptions = {
  workTime?: number;
  pauseTime?: number;
  onPause?: (index: number) => void;
  onContinue?: (index: number) => void;
  signal?: AbortSignal;
};

class ForEachWorker<T> {
  iterationStart!: number;

  index: number = 0;

  thread: Generator<number>;

  options: ForEachOptions;

  constructor(
    iterable: Iterable<T>,
    cb: (value: T, index: number) => void,
    options: ForEachOptions,
  ) {
    this.options = options;
    this.thread = (function* thread(this: ForEachWorker<T>): Generator<number> {
      for (const item of iterable) {
        if (Date.now() - this.iterationStart > this.workTime || this.options.signal?.aborted) {
          // yield paused element index
          yield this.index;
          this.options.onContinue?.(this.index);
          this.iterationStart = Date.now();
        }
        cb(item, this.index);
        this.index += 1;
      }
    }.call(this));
  }

  [Symbol.toStringTag]: string = '[object ForEachWorker]';

  get workTime() {
    return this.options.workTime || MAX_WORK_TIME;
  }

  get pauseTime() {
    return this.options.pauseTime || PAUSE_TIME;
  }

  work(resolve: () => void, reject: (error?: unknown) => void) {
    this.iterationStart = Date.now();
    try {
      const { value, done } = this.thread.next();
      if (this.options.signal?.aborted) {
        reject();
      } else if (!done) {
        this.options.onPause?.(value);
        setTimeout(this.work.bind(this, resolve, reject), this.pauseTime);
      } else {
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  }
}

export default function forEach<T>(
  iterable: Iterable<T>,
  cb: (value: T, index: number) => void,
  options: ForEachOptions = {},
): Promise<void> {
  const worker = new ForEachWorker(iterable, cb, options);
  return new Promise<void>((resolve, reject) => { worker.work(resolve, reject); });
}
