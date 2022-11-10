/* eslint-disable no-param-reassign */
import skipBits from './utils/skipBits';
import takeBits from './utils/takeBits';

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
export default class UintBitsReader {
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

  get byte(): number | undefined {
    return this.buffer[this.position];
  }

  /**
   * Move to the specified byte
   * @param offset
   * @param resetRemainder Reset the bit remainder
   */
  seek(offset: number, resetRemainder = false) {
    this.position += offset;
    if (resetRemainder) {
      this.bitRemainder = 0;
    }
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
   * @param bits
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
      let bitsRead = bits >= BITS_IN_BYTE ? BITS_IN_BYTE : bits;
      if (this.bitRemainder > 0) {
        currentBits = skipBits(this.byte, BITS_IN_BYTE - this.bitRemainder, BITS_IN_BYTE);
        if (bitsRead > this.bitRemainder) {
          bitsRead = this.bitRemainder;
        }
        currentBits = takeBits(currentBits, bitsRead);
        this.bitRemainder -= bitsRead;
      } else {
        currentBits = takeBits(this.byte, bitsRead, BITS_IN_BYTE);
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

  values(bits: number): IterableIterator<number> {
    const instance = this;
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
        // rewind bitstream on iterator end
        instance.rewind();
        return { value: undefined, done: true };
      },
    };
  }
}
