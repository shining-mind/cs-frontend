import ConcreteStructure from './ConcreteStructure';

describe('ConcreteStructure', () => {
  test('contract', () => {
    const jackBlack = new ConcreteStructure(['name', 'lastName', 'age']);
    jackBlack.set('name', 'Jack');
    jackBlack.set('lastName', 'Black');
    jackBlack.set('age', 53);
    expect(jackBlack.get('name')).toEqual('Jack');
    expect(jackBlack.get('lastName')).toEqual('Black');
    expect(jackBlack.get('age')).toEqual(53);
  });

  test('should throw TypeError on key violiation', () => {
    const struct = new ConcreteStructure(['name']);
    expect(() => struct.get('unexisting')).toThrow(TypeError);
  });
});
