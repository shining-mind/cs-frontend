import primeGenerator from './prime-generator';

// eslint-disable-next-line max-len
const PRIME_NUMBERS_UP_TO_100 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

describe('primeGenerator', () => {
  test('generate prime numbers up to 100', () => {
    expect(Array.from(primeGenerator(2, 100))).toEqual(PRIME_NUMBERS_UP_TO_100);
  });

  test('generate prime numbers from 31 up to 100', () => {
    expect(Array.from(primeGenerator(31, 100))).toEqual(PRIME_NUMBERS_UP_TO_100.slice(10));
  });
});
