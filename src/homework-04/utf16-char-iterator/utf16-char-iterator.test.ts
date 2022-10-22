import utf16CharIterator from './utf16-char-iterator';

describe('utf16CharIterator', () => {
  test('iterate smile', () => {
    expect(Array.from(utf16CharIterator('😀'))).toEqual(['😀']);
  });

  test('iterate message with emojis', () => {
    expect(Array.from(utf16CharIterator('Hello world! 🚩 How are you? 😀'))).toEqual([
      'H', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd', '!', ' ', '🚩', ' ',
      'H', 'o', 'w', ' ', 'a', 'r', 'e', ' ', 'y', 'o', 'u', '?', ' ', '😀',
    ]);
  });

  test('should ignore invalid chars', () => {
    expect(Array.from(utf16CharIterator('\uD83D'))).toEqual([]);
    expect(Array.from(utf16CharIterator('Hi\uD83D!'))).toEqual(['H', 'i', '!']);
    expect(Array.from(utf16CharIterator('😀\uD83D🚩'))).toEqual(['😀', '🚩']);
  });

  test('should return 0 items for empty string', () => {
    expect(Array.from(utf16CharIterator(''))).toEqual([]);
  });
});
