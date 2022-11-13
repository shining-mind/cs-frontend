type GetFlagValue = (flag: string) => number;

export default class BitField {
  #value: number;

  #getFlagValue: GetFlagValue;

  constructor(value: number, getFlagValue: GetFlagValue) {
    this.#value = value;
    this.#getFlagValue = getFlagValue;
  }

  can(...flags: string[]): boolean {
    return this.has(...flags);
  }

  has(...flags: string[]): boolean {
    for (const flag of flags) {
      if ((this.#value & this.#getFlagValue(flag)) === 0) {
        return false;
      }
    }
    return true;
  }

  any(...flags: string[]): boolean {
    for (const flag of flags) {
      if ((this.#value & this.#getFlagValue(flag)) > 0) {
        return true;
      }
    }
    return false;
  }

  valueOf() {
    return this.#value;
  }
}
