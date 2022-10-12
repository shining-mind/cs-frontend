# Библиотека для чтения потока бит

Данная библиотека реализует функцию `ReadBits` из спецификации [webp](https://developers.google.com/speed/webp/docs/webp_lossless_bitstream_specification).


Байты считываются в естественном порядке содержащего их потока, а биты каждого байта считываются в порядке младших значащих битов. Когда несколько битов считываются одновременно, целое число создается из исходных данных в исходном порядке. Старшие биты возвращаемого целого числа также являются старшими битами исходных данных. Таким образом, утверждение

```
b = ReadBits(2);
```

эквивалентно двум приведенным ниже утверждениям:

```
b = ReadBits(1);
b |= ReadBits(1) << 1;
```

## Быстрый старт

**Чтение данных из потока по 1 биту за раз:**

```JS
// создаём буфер с двумя байтами
const buffer = new Uint8Array([0b10011001, 0b10100001]);
const bitReader = new UintBitsReader(buffer);
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
const bitReader = new UintBitsReader(buffer);
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
bitReader.seek(1, true)
```

**Итератор по N-битовым числам:**

```JS
const buffer = new Uint8Array([0b11100111, 0b01111001, 0b10011110]);
const bitReader = new UintBitsReader(buffer);
const numbers = Array.from(bitReader.values(3)); // [0b111, 0b100, 0b111, 0b100, 0b111, 0b100, 0b111, 0b100]

```

## Ограничения

1. UintBitsReader работает только с целыми числами
2. Нельзя считать число больше 32bit из-за ограничений побитовых операторов в JS