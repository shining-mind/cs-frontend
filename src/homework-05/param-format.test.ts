/* eslint-disable no-template-curly-in-string */
import paramFormat from './param-format';

describe('paramFormat', () => {
  test('should format string', () => {
    const formatted = paramFormat(
      'Hello, ${user}! Your age is ${age}.',
      { user: 'Bob', age: 10 },
    );
    expect(formatted).toEqual('Hello, Bob! Your age is 10.');
  });

  test('should support keys with whitespace and dash', () => {
    const formatted = paramFormat(
      'Hello, ${user name}! You are cool ${p-k}',
      { 'user name': 'Bob', 'p-k': 'boy' },
    );
    expect(formatted).toEqual('Hello, Bob! You are cool boy');
  });
});
