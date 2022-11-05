type ImmediateCallback = () => void;

type ImmediateTimer = {};

export const [setImmediate, clearImmediate] = (() => {
  const callbacks = new WeakMap<ImmediateTimer, ImmediateCallback>();

  const set = (callback: ImmediateCallback): ImmediateTimer => {
    // Create key for immediate
    const key = {};
    callbacks.set(key, callback);
    // Queue callback
    queueMicrotask(() => {
      const func = callbacks.get(key);
      if (typeof func === 'function') {
        func();
      }
    });
    return key;
  };

  const clear = (key: ImmediateTimer) => {
    callbacks.delete(key);
  };

  return [set, clear];
})();
