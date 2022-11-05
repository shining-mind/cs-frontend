export default function timeout<T>(promise: Promise<T>, timeoutAfter: number): Promise<T> {
  return new Promise((resolve, reject) => {
    promise
      .then(resolve)
      .catch(reject);
    setTimeout(() => reject(new Error('Timeout reached')), timeoutAfter);
  });
}
