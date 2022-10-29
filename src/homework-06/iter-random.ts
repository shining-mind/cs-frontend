/**
 * @param {number} [min]
 * @param {number} [max]
 */
function randomInt(min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
  // получить случайное число от (min - 0.5) до (max + 0.5) и округлить
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

/**
 * @param min Min value
 * @param max Max value
 * @returns Random number between min and max
 */
export default function iterRandom(min: number, max: number): IterableIterator<number> {
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      return { value: randomInt(min, max), done: false };
    },
  };
}
