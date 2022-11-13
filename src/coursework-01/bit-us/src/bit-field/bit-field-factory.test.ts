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

    test('should return integer value of the applied flags', () => {
      expect(bob.valueOf()).toEqual(1 | 2);
      const admin = userPermissions.create('read', 'write', 'edit');
      expect(admin.valueOf()).toEqual(1 | 2 | 4);
    });

    test('should throw if unknown flag is passed', () => {
      expect(() => bob.can('delete')).toThrowError('Unknown flag: delete');
    });
  });
});
