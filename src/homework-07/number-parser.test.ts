import numberParser from './number-parser';

describe('numberParser', () => {
  test('should parse number in exponential form', () => {
    const parser1 = numberParser();
    parser1.next('-');
    parser1.next('14');
    parser1.next('.');
    parser1.next('53');
    parser1.next('e-');
    parser1.next('2');
    expect(parser1.return().value).toEqual(-0.1453);

    const parser2 = numberParser();
    parser2.next('14');
    parser2.next('.e1');
    expect(parser2.return().value).toEqual(140);
  });

  test('should parse whole number', () => {
    const parser1 = numberParser();
    parser1.next('-');
    parser1.next('14');
    expect(parser1.return().value).toEqual(-14);

    const parser2 = numberParser();
    parser2.next('1');
    parser2.next('4');
    expect(parser2.return().value).toEqual(14);
  });

  test('should parse number with fraction', () => {
    const parser1 = numberParser();
    parser1.next('-');
    parser1.next('14.45');
    expect(parser1.return().value).toEqual(-14.45);

    const parser2 = numberParser();
    parser2.next('1');
    parser2.next('4');
    parser2.next('.');
    parser2.next('4');
    parser2.next('5');
    expect(parser2.return().value).toEqual(14.45);
  });

  test('should throw on invalid number', () => {
    const parser1 = numberParser();
    expect(() => parser1.next('-14-5')).toThrow('Unexpected symbol in "-14[-]"');
    expect(parser1.next('-5')).toEqual({ value: undefined, done: true });

    const parser2 = numberParser();
    expect(() => parser2.next('--5')).toThrow('Unexpected symbol in "-[-]"');

    const parser3 = numberParser();
    expect(() => parser3.next('5__0')).toThrow('Unexpected symbol in "5_[_]"');

    const parser4 = numberParser();
    expect(() => parser4.next('_0')).toThrow('Unexpected symbol in "[_]"');

    const parser5 = numberParser();
    expect(() => parser5.next('14..3')).toThrow('Unexpected symbol in "14.[.]"');
  });

  test('should parse number with underscores', () => {
    const parser1 = numberParser();
    parser1.next('-14_5');
    expect(parser1.return().value).toEqual(-145);

    const parser2 = numberParser();
    parser2.next('1_4_5');
    expect(parser2.return().value).toEqual(145);
  });
});
