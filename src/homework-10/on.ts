export default function on<K extends keyof HTMLElementEventMap>(
  el: HTMLElement,
  eventName: K,
  options?: boolean | AddEventListenerOptions,
): AsyncIterableIterator<HTMLElementEventMap[K]> {
  let handleEvent: ((event: HTMLElementEventMap[K]) => void) | null = null;
  function listener(this: HTMLElement, event: HTMLElementEventMap[K]) {
    if (typeof handleEvent === 'function') {
      handleEvent(event);
    }
    handleEvent = null;
  }
  el.addEventListener(eventName, listener, options);
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    next() {
      return new Promise((resolve) => {
        handleEvent = (event: HTMLElementEventMap[K]) => resolve({ done: false, value: event });
      });
    },
    return() {
      el.removeEventListener(eventName, listener);
      return Promise.resolve({ value: undefined, done: true });
    },
  };
}
