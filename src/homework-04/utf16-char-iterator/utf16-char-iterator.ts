// @see https://www.rfc-editor.org/rfc/rfc2781#section-2.2

// eslint-disable-next-line import/no-relative-packages
import takeBitsLSB from '../../coursework-01/bit-us/src/utils/take-bits-lsb';

export default function utf16CharIterator(str: string): IterableIterator<string> {
  let i = 0;
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      if (i >= str.length) {
        return { done: true, value: undefined };
      }
      const w1 = str.charCodeAt(i);
      i += 1;
      // 16 bit char
      if (w1 < 0xD800 || w1 > 0xDFFF) {
        return { done: false, value: String.fromCodePoint(w1) };
      }
      // Surrogate pair
      if (w1 >= 0xD800 && w1 <= 0xDBFF) {
        const w2 = str.charCodeAt(i);
        if (w2 >= 0xDC00 && w2 <= 0xDFFF) {
          // Increment only if w2 is valid,
          // otherwise it will be treated as w1 for next char
          i += 1;
          // eslint-disable-next-line no-bitwise
          const codePoint = (takeBitsLSB(w1, 10) << 10) | takeBitsLSB(w2, 10);
          return { done: false, value: String.fromCodePoint(codePoint + 0x10000) };
        }
      }
      // If sequence is invalid go to next char
      return this.next();
    },
  };
}
