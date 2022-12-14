# Утилиты для чтения бинарных данных


## UintLSBReader - чтение потока бит в порядке LSB

Реализует функцию `ReadBits` из спецификации [webp](https://developers.google.com/speed/webp/docs/webp_lossless_bitstream_specification).


Байты считываются в естественном порядке содержащего их потока, а биты каждого байта считываются в порядке младших значащих битов. Когда несколько битов считываются одновременно, целое число создается из исходных данных в исходном порядке. Старшие биты возвращаемого целого числа также являются старшими битами исходных данных. Таким образом, утверждение

```
b = ReadBits(2);
```

эквивалентно двум приведенным ниже утверждениям:

```
b = ReadBits(1);
b |= ReadBits(1) << 1;
```

### Примеры

**Чтение 14 битных чисел:**

```JS
const buffer = new Uint8Array([0x8f, 0x01, 0x4b, 0x10]);
const bitReader = new UintLSBReader(buffer);
bitReader.read(14) // 399
bitReader.read(14) // 300

```

**Чтение по 1 биту за раз:**

```JS
// создаём буфер с двумя байтами
const buffer = new Uint8Array([0b10011001, 0b10100001]);
const bitReader = new UintLSBReader(buffer);
// читаем данные по одному биту за раз
bitReader.read(1) // 1
bitReader.read(1) // 0
bitReader.read(1) // 0
bitReader.read(1) // 1
bitReader.read(1) // 1
bitReader.read(1) // 0
bitReader.read(1) // 0
bitReader.read(1) // 1
bitReader.read(1) // 1
bitReader.read(1) // 0
bitReader.read(1) // 0
bitReader.read(1) // 0
bitReader.read(1) // 0
bitReader.read(1) // 1
bitReader.read(1) // 0
bitReader.read(1) // 1

```

**Чтение с пропуском:**

```JS
const buffer = new Uint8Array([0b10011001, 0b10100001]);
const bitReader = new UintLSBReader(buffer);
bitReader.read(1) // 1
bitReader.read(1) // 0
bitReader.read(1) // 0
bitReader.read(1) // 1
bitReader.seek(1) // переходим к следующему байту при этом смещение остаётся 4 бита
bitReader.read(1) // 0
bitReader.read(1) // 1
bitReader.read(1) // 0
bitReader.read(1) // 1
```

Также можно перейти на начало следующего байта, сбросив смещение бит на ноль: 

```JS
bitReader.seekWithReset(1)
```

**Побитовый итератор:**

```JS
const buffer = new Uint8Array([0b10100111]);
const bitReader = new UintLSBReader(buffer);
const numbers = Array.from(bitReader); // [1, 1, 1, 0, 0, 1, 0, 1]

```

**Итератор по N-битовым числам:**

```JS
const buffer = new Uint8Array([0b11100111, 0b01111001, 0b10011110]);
const bitReader = new UintLSBReader(buffer);
const numbers = Array.from(bitReader.values(3)); // [0b111, 0b100, 0b111, 0b100, 0b111, 0b100, 0b111, 0b100]

```

### API

**Свойства**

`byte` - текущий байт

**Методы**

- `seek(n)` - перейти вперед на N байт
- `seekWithReset(n)` - перейти вперед на N байт и сбросить остаток бит на ноль
- `rewind()` - вернуть указатель на первый байт и сбросить остаток бит на ноль
- `read(n)` - прочитать N битовое беззнаковое число
- `values(n)` - получить итератор по N битовым беззнаковым числам

### Ограничения

1. UintLSBReader работает только с целыми положительными числами
2. Нельзя считать число больше 53bit из-за ограничений IEEE-754