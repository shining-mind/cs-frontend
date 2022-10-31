enum NumberParserState {
  INITIAL,
  UNARY_MINUS,
  WHOLE,
  DOT,
  FRACTION,
  EXP_CONST,
  EXP_MINUS,
  EXP,
  UNDERSCORE,
}

export default function numberParser() {
  let expr = '';
  const invalid = (symbol: string) => {
    throw new Error(`Unexpected symbol in "${expr}[${symbol}]"`);
  };
  const gen = (function* generator(): Generator<number | string, void, string> {
    let input = '';
    let state: NumberParserState = NumberParserState.INITIAL;
    while (true) {
      for (const symbol of input) {
        switch (symbol) {
          case '-':
            if (state !== NumberParserState.INITIAL && state !== NumberParserState.EXP_CONST) {
              invalid(symbol);
            }
            if (state === NumberParserState.INITIAL) {
              state = NumberParserState.UNARY_MINUS;
            } else if (state === NumberParserState.EXP_CONST) {
              state = NumberParserState.EXP_MINUS;
            }
            break;
          case '.':
            if (state !== NumberParserState.WHOLE) {
              invalid(symbol);
            }
            state = NumberParserState.DOT;
            break;
          case 'e':
            if (state !== NumberParserState.WHOLE
              && state !== NumberParserState.DOT
              && state !== NumberParserState.FRACTION
            ) {
              invalid(symbol);
            }
            state = NumberParserState.EXP_CONST;
            break;
          case '_':
            if (
              state !== NumberParserState.WHOLE
              && state !== NumberParserState.FRACTION
            ) {
              invalid(symbol);
            }
            state = NumberParserState.UNDERSCORE;
            break;
          default:
            if (!/\d/.test(symbol)) {
              invalid(symbol);
            }
            if (state === NumberParserState.DOT || state === NumberParserState.FRACTION) {
              state = NumberParserState.FRACTION;
            } else if (
              state === NumberParserState.EXP_CONST
              || state === NumberParserState.EXP
              || state === NumberParserState.EXP_MINUS
            ) {
              state = NumberParserState.EXP;
            } else {
              state = NumberParserState.WHOLE;
            }
            break;
        }
        expr += symbol;
      }
      input = yield expr;
    }
  }());

  gen.next();

  Object.defineProperty(gen, 'return', {
    value() {
      return { value: parseFloat(expr.replace(/_/g, '')), done: true };
    },
  });

  return gen;
}
