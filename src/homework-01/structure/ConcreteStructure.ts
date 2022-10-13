import Structure from './Structure';

type GetIndex = (key: string) => number;

export default class ConcreteStructure implements Structure {
  #properties: Array<unknown>;

  #getIndex: GetIndex;

  constructor(properties: Array<string>) {
    this.#properties = new Array(properties.length);
    this.#getIndex = ConcreteStructure.generateGetIndex(properties);
  }

  set<T = unknown>(key: string, value: T): this {
    this.#properties[this.#getIndex(key)] = value;
    return this;
  }

  get<T = unknown>(key: string): T {
    return this.#properties[this.#getIndex(key)] as T;
  }

  static generateGetIndex(properties: Array<string>): GetIndex {
    const functionBody = `switch(key) {
      ${properties.map((key, i) => `case '${key}': return ${i};`).join('')}
      default: throw new TypeError('Unknown property: ' + key)
    }`;
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    return new Function('key', functionBody) as GetIndex;
  }
}
