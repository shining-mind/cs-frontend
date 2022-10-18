// Credits to https://github.com/Prabhakar-Poudel/random-prime#readme
export const isPrime = (number: number): boolean => {
  if (!Number.isInteger(number)) return false;
  if (number < 2) return false;
  if (number === 2 || number === 3) return true;
  if (number % 2 === 0 || number % 3 === 0) return false;

  const maxDivisor = Math.floor(Math.sqrt(number));
  for (let i = 5; i <= maxDivisor; i += 6) {
    if (number % i === 0 || number % (i + 2) === 0) return false;
  }

  return true;
};

export default function primeGenerator(
  initialPrime: number = 2,
  max: number = Infinity,
): IterableIterator<number> {
  if (!isPrime(initialPrime)) {
    throw new TypeError('initialPrime must be a prime number');
  }
  let prime = initialPrime;
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      let value = prime;
      if (prime === 2) {
        prime = 3;
      } else if (prime >= 3) {
        while (!isPrime(prime)) prime += 2;
        value = prime;
        prime += 2;
      }
      if (prime > max) {
        return { value: undefined, done: true };
      }
      return { value, done: false };
    },
  };
}
