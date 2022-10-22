import isNumber from './is-number';

describe('isNumber', () => {
  test('should detect Arabic number', () => {
    expect(isNumber('123')).toEqual(true);
  });

  test('should detect Roman number', () => {
    expect(isNumber('Ⅻ')).toEqual(true);
  });

  test('should detect Devanagari number', () => {
    expect(isNumber('०१२३४५६७८९')).toEqual(true);
  });

  test('should detect Bengali number', () => {
    expect(isNumber('০১২৩৪৫৬৭৮৯')).toEqual(true);
  });

  test('should detect Gurmukhi number', () => {
    expect(isNumber('੦੧੨੩੪੫੬੭੮੯')).toEqual(true);
  });

  test('should detect Brahmi number', () => {
    expect(isNumber('𑁦𑁧𑁨𑁩𑁪𑁫𑁬𑁭𑁮𑁯')).toEqual(true);
  });

  test('should detect Thai number', () => {
    expect(isNumber('๐๑๒๓๔๕๖๗๘๙')).toEqual(true);
  });

  test('should be falsy for mixed number', () => {
    expect(isNumber('123Ⅻ')).toEqual(false);
  });

  test('should be falsy for mixed content', () => {
    expect(isNumber('123ABC')).toEqual(false);
  });

  test('should be falsy for letters', () => {
    expect(isNumber('ABC')).toEqual(false);
  });
});
