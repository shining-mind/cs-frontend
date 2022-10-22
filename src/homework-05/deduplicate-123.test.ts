import deduplicate123 from './deduplicate-123';

describe('deduplicate123', () => {
  test('should deduplicate 1 length groups', () => {
    expect(deduplicate123('aaaabbbbczzzz')).toEqual('abcz');
  });

  test('should deduplicate mixed 2 and 3 length groups', () => {
    // ab * 3, b * 2, abc * 2
    expect(deduplicate123('abababbbabcabc')).toEqual('abbabc');
    // foo * 2, ba * 2, a * 4, z * 2
    expect(deduplicate123('foofoobabaaaazze')).toEqual('foobaaze');
  });
});
