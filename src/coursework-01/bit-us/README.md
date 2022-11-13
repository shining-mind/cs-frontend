# Библиотека для удобной работы с битовыми структурами

Рабочее название библиотеки **bit-us** (Bit utilities and structures)

## Установка из репозитория

1. `git clone https://github.com/shining-mind/cs-frontend.git`
2. `cd cs-frontend`
3. `npm i`
4. `cd src/coursework-01/bit-us`
5. `npm run build`
6. `npm pack`
7. Перейти в директорию проекта в который надо установить пакет
8. `npm i /path/to/package/bit-us-0.1.0.tgz`

## Чтение бинарных данных:

- `UintLSBReader` - чтение бинарного потока в LSB порядке (реализация ReadBits из спецификации webp), [подробнее](readers/README.md#uintlsbreader---чтение-потока-бит-в-порядке-lsb)

## Структуры:

### BitVector - битовый вектор с поддержкой 8, 16, 32 битовых слов

```JS
const vec = new BitVector(3)
vec.push(1) // 1
vec.push(1) // 2
vec.push(0) // 3
vec.set(2, 0)
vec.get(2) // 0
vec.set(2, 1)
vec.get(2) // 1
vec.set(0, 0)
vec.get(0) // 0

Array.from(vec) // [0, 1, 1]
```

#### API

**Свойства**

- `capacity` - аллоцированный размер
- `length` - количество бит в векторе
- `byteLength` - аллоцированные байты

**Методы**

- `push(value)` - добавить бит в вектор
- `set(n, value)` - задать значение N-го бита
- `get(n)` - получить значение N-го бита
- `toBlob()` - преобразовать вектор в `Blob`. Первые 4 байта выделены под длину вектора, остальные - под данные. Доступно только для вектора из 8 битных слов.

### Битовые маски (TODO)

## Вспомогательные функции:

- `takeBits(int, n, k)` - взять первые N бит из числа размером K бит
- `skipBits(int, n, k)` - пропустить первые N бит из числа размером K бит
- `takeBitsLSB(int, n)` - взять N бит начиная с младшего бита из числа
- `skipBitsLSB(int, n, k)` - пропустить N бит начиная с младшего бита из числа размером K бит