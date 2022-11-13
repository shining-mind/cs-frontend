import { FlagMap } from '../types';
import BitField from './bit-field';

export default class BitFieldFactory {
  /**
   * Flag to int constant
   */
  #map: FlagMap;

  constructor(...flags: string[]) {
    if (flags.length > 32) {
      throw new TypeError('Can\'t create bitfield with more than 32 flags');
    }
    this.#map = new Map(flags.map((flag, i) => ([flag, 2 ** i])));
  }

  create(...flags: string[]): BitField {
    const value = flags.reduce((acc, flag) => acc | this.getFlagValue(flag), 0);
    return new BitField(value, this.getFlagValue.bind(this));
  }

  getFlagValue(flag: string): number {
    const flagValue = this.#map.get(flag);
    if (flagValue === undefined) {
      throw new TypeError(`Unknown flag: ${flag}`);
    }
    return flagValue;
  }
}
