/* eslint-disable no-param-reassign */
import ConcreteDoublyLinkedList from '../../homework-01/linked-list/ConcreteDoublyLinkedList';
import { DoublyLinkedListItem } from '../../homework-01/linked-list/DoublyLinkedList';
import DynamicArray from './DynamicArray';

export default class LinkedListDynamicArray<T> implements DynamicArray<T>, Iterable<T> {
  #length: number;

  #capacity: number;

  protected list: ConcreteDoublyLinkedList<Array<T>> = new ConcreteDoublyLinkedList<Array<T>>();

  constructor(capacity: number) {
    this.#length = 0;
    this.#capacity = capacity;
  }

  get length(): number {
    return this.#length;
  }

  add(data: T): void {
    const arr = this.list?.tail?.data;
    if (!arr || arr[arr.length - 1] !== undefined) {
      this.grow();
      this.add(data);
    } else {
      arr[this.getInnerIndex(this.#length)] = data;
      this.#length += 1;
    }
  }

  get(index: number): T | undefined {
    const item = this.findListItemForIndex(index);
    return item === null ? undefined : item.data[this.getInnerIndex(index)];
  }

  // TODO: refactor
  splice(start: number, deleteCount: number, ...items: T[]): T[] {
    if (start < 0) {
      throw new TypeError(`Invalid start parameter: ${start}`);
    }
    const canDelete = this.length - start;
    if (start >= this.#length) {
      start = this.#length + 1;
    }
    const availableForDelete = deleteCount < canDelete ? deleteCount : canDelete;
    // Prepare fixed array for removed values
    const removedValues = new Array<T>(availableForDelete);
    let empty = 0;
    let item = this.findListItemForIndex(start);
    let emptyFromIndex = -1;
    let nonEmptyIndex = -1;
    let remaining = availableForDelete;
    let index = this.getInnerIndex(start);
    let replaced = 0;
    // REPLACE - Fill underlying arrays with provided items
    while (item !== null && remaining > 0 && items.length > 0) {
      if (items.length) {
        const insert = items.splice(0, Math.min(remaining, this.#capacity - index));
        removedValues.splice(
          availableForDelete - remaining,
          insert.length,
          ...item.data.splice(index, insert.length, ...insert),
        );
        index += insert.length;
        start += insert.length;
        replaced += insert.length;
        remaining -= insert.length;
      }
      if (index >= this.#capacity) {
        item = item.next;
        index = 0;
      }
    }
    // ADD
    if (items.length > 0) {
      let lastItem = this.list.tail;
      const listItems = this.grow(items.length);
      // ADD TO END
      if (item === null) {
        let i = 0;
        while (items.length > 0) {
          const insert = items.splice(0, this.#capacity);
          for (let j = 0; j < insert.length; j += 1) {
            listItems[i].data[j] = insert[j];
          }
          this.#length += insert.length;
          i += 1;
        }
      // SHIFT to RIGHT
      } else if (lastItem !== null) {
        let i1 = this.#length - 1;
        let i2 = i1 + items.length;
        item = listItems[listItems.length - 1];
        while (i1 >= start && lastItem !== null && item !== null) {
          const k2 = this.getInnerIndex(i2);
          const k1 = this.getInnerIndex(i1);
          item.data[k2] = lastItem.data[k1];
          delete lastItem.data[k1];
          i1 -= 1;
          i2 -= 1;
          if (this.getInnerIndex(i1) > k1) {
            lastItem = lastItem.prev;
          }
          if (this.getInnerIndex(i2) > k2) {
            item = item.prev;
          }
        }
        // FILL EMPTY
        if (lastItem !== null) {
          let j = 0;
          let i = i1 + 1;
          while (i < start + items.length && lastItem !== null) {
            const k = this.getInnerIndex(i);
            lastItem.data[k] = items[j];
            i += 1;
            j += 1;
            if (this.getInnerIndex(i) < k) {
              lastItem = lastItem.next;
            }
          }
        }
        this.#length += items.length;
      }
    } else {
      emptyFromIndex = start;
      // DELETE - Remove values if array was not filled by items
      while (item !== null && remaining > 0) {
        const to = remaining > this.#capacity - index ? this.#capacity : remaining + index;
        for (let i = index; i < to; i += 1) {
          removedValues[availableForDelete - remaining] = item.data[i];
          const offset = availableForDelete - replaced - remaining;
          nonEmptyIndex = start + offset + 1;
          remaining -= 1;
          empty += 1;
          delete item.data[i];
        }
        index = 0;
        item = item.next;
      }
      // SHIFT
      if (empty > 0) {
        let i1 = emptyFromIndex;
        let i2 = Math.min(nonEmptyIndex, this.#length);
        let item1 = this.findListItemForIndex(i1);
        let item2 = this.findListItemForIndex(nonEmptyIndex);
        while (item1 !== null && item2 !== null) {
          const k1 = this.getInnerIndex(i1);
          const k2 = this.getInnerIndex(i2);
          item1.data[k1] = item2.data[k2];
          delete item2.data[k2];
          i1 += 1;
          i2 += 1;
          if (this.getInnerIndex(i1) < k1) {
            item1 = item1.next;
          }
          if (this.getInnerIndex(i2) < k2) {
            item2 = item2.next;
          }
        }
        this.#length -= empty;
        this.shrink(empty);
      }
    }
    return removedValues;
  }

  * [Symbol.iterator](): Iterator<T> {
    for (const arr of this.list) {
      for (let i = 0; i < this.#capacity; i += 1) {
        yield arr[i];
      }
    }
  }

  protected findListItemForIndex(index: number): DoublyLinkedListItem<Array<T>> | null {
    const target = Math.floor(index / this.#capacity);
    let i = 0;
    let item = this.list.head;
    while (item !== null && target !== i) {
      item = item.next;
      i += 1;
    }
    return item;
  }

  protected grow(size: number = this.#capacity): DoublyLinkedListItem<Array<T>>[] {
    const total = Math.ceil(size / this.#capacity);
    const itemsAdded = new Array(total);
    for (let i = 0; i < total; i += 1) {
      this.list.add(new Array<T>(this.#capacity));
      itemsAdded[i] = this.list.tail;
    }
    return itemsAdded;
  }

  protected shrink(size: number = this.#capacity): void {
    const total = Math.floor(size / this.#capacity);
    for (let i = 0; i < total; i += 1) {
      this.list.pop();
    }
  }

  protected getInnerIndex(globalIndex: number): number {
    return globalIndex % this.#capacity;
  }
}
