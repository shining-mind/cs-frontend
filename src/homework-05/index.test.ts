describe('homework-05', () => {
  test('task #1', () => {
    expect(/^[a-z0-9_$]+$/.test('привет')).toEqual(false);
  });

  test('task #2', () => {
    expect('foo    bla.bar,gd;4'.split(/[.,;]|\s+/)).toEqual(['foo', 'bla', 'bar', 'gd', '4']);
  });
});
