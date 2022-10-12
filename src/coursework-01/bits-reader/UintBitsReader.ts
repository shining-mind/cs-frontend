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
   * Raw data
   */
  protected buffer: ArrayBuffer;

  /**
   * Uint 8 array view of the buffer
   */
  protected uint8View: Uint8Array;

  /**
   * Current byte position
   */
  protected position: number = 0;

  /**
   * Remaining bits in current byte
   */
  protected bitRemainder: number = 0;

  constructor(buffer: ArrayBuffer) {
    this.buffer = buffer;
    this.uint8View = new Uint8Array(buffer);
  }

  get byte(): number | undefined {
    return this.uint8View[this.position];
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
      if (this.assertNotEOF()) {
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
    }
    return result;
  }

  protected assertNotEOF(): this is { byte: number } {
    if (this.byte === undefined) {
      throw new Error('Reached bitstream end');
    }
    return true;
  }
}
