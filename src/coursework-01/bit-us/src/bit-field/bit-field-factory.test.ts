import BitFieldFactory from './bit-field-factory';

describe('bit-us', () => {
  describe('BitField', () => {
    const userPermissions = new BitFieldFactory('read', 'write', 'edit');
    const bob = userPermissions.create('read', 'write');

    test('should return true if it has all flags', () => {
      expect(bob.has('read', 'write')).toBeTruthy();
      expect(bob.has('read', 'write', 'edit')).toBeFalsy();
    });

    test('should return true if it has any of the flags', () => {
      expect(bob.any()).toBeFalsy();
      expect(bob.any('edit')).toBeFalsy();
      expect(bob.any('read', 'write', 'edit')).toBeTruthy();
    });
  });
});
