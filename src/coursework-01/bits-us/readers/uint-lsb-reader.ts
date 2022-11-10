/* eslint-disable no-param-reassign */
import skipBitsLSB from '../utils/skip-bits-lsb';
import takeBitsLSB from '../utils/take-bits-lsb';

const BITS_IN_BYTE = 8;

/**
 * This class is used for reading bitstream.
 * It reads bytes in the natural order and bits in LSB order.
 *
 * @example
 * ```
 * b = ReadBits(2);
 * ```
 * is equivalent with the two statements below:
 * ```
 * b = ReadBits(1);
 * b |= ReadBits(1) << 1;
 * ```
 */
export default class UintLSBReader {
  /**
   * Uint 8 array view of the buffer
   */
  protected buffer: Uint8Array;

  /**
   * Current byte position
   */
  protected position: number = 0;

  /**
   * Remaining bits in current byte
   */
  protected bitRemainder: number = 0;

  constructor(buffer: Uint8Array) {
    this.buffer = buffer;
  }

  /**
   * Getter for current byte
   */
  get byte(): number | undefined {
    return this.buffer[this.position];
  }

  /**
   * Move to the specified byte
   * @param offset
   * @param resetRemainder Reset the bit remainder
   */
  seek(offset: number, resetRemainder: boolean = false): void {
    this.position += offset;
    if (resetRemainder) {
      this.bitRemainder = 0;
    }
  }

  /**
   * Move to the specified byte with bit remainder reset
   * @param offset
   */
  seekWithReset(offset: number): void {
    this.seek(offset, true);
  }

  /**
   * Rewind the bitstream
   */
  rewind() {
    this.position = 0;
    this.bitRemainder = 0;
  }

  /**
   * Read bits
   * @param bits Number of bits to read
   * @returns Uint
   */
  read(bits: number): number {
    let result = 0;
    let resultSize = 0;
    if (bits < 1 || bits > 32) {
      throw new TypeError('Unsupported bit count');
    }
    while (bits > 0) {
      if (this.byte === undefined) {
        throw new Error('Reached bitstream end');
      }
      let currentBits = 0;
      // Max 8 bits can be read per iteration
      let bitsRead = Math.min(BITS_IN_BYTE, bits);
      // Read reamining bits from current byte
      if (this.bitRemainder > 0) {
        currentBits = skipBitsLSB(this.byte, BITS_IN_BYTE - this.bitRemainder, BITS_IN_BYTE);
        // Prevent overlow: if we want to read more than we can, change the amount of bits to read
        if (bitsRead > this.bitRemainder) {
          bitsRead = this.bitRemainder;
        }
        currentBits = takeBitsLSB(currentBits, bitsRead);
        this.bitRemainder -= bitsRead;
      } else {
        currentBits = takeBitsLSB(this.byte, bitsRead, BITS_IN_BYTE);
        this.bitRemainder = BITS_IN_BYTE - bitsRead;
      }
      bits -= bitsRead;
      result |= currentBits << resultSize;
      resultSize += bitsRead;
      // Go to next byte if nothing left
      if (this.bitRemainder === 0) {
        this.seek(1);
      }
    }
    return result;
  }

  /**
   * @returns Iterator on the bits
   */
  [Symbol.iterator](): IterableIterator<number> {
    return this.values(1);
  }

  /**
   * Iterate N-bit numbers
   * @param bits N-bit number
   * @returns Iterator on the N-bit numbers
   * @throws {TypeError} If total bit count can't be devided by N-bits
   */
  values(bits: number): IterableIterator<number> {
    // Create new instance, because current position must be preserved
    const instance = new UintLSBReader(this.buffer);
    if ((this.buffer.byteLength * BITS_IN_BYTE) % bits !== 0) {
      throw new TypeError(`Bytes can't be devided by ${bits} bits`);
    }
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        if (instance.byte !== undefined) {
          return { value: instance.read(bits), done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }
}
