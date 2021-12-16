class PriorityQueue {
  #comparator;

  #elements;
  #indexLookup;

  constructor(comparator) {
    this.#comparator = comparator;

    this.#elements = [0];
    this.#indexLookup = new Map();
  }

  get size() {
    return this.#elements.length - 1;
  }

  peek() {
    return this.#elements[1];
  }

  pop() {
    if (this.size < 1) {
      throw new Error();
    }

    this._swap(1, this.size);

    const element = this.#elements.pop();
    this.#indexLookup.delete(element.key);

    this._heapify(1);

    return element;
  }

  includes(key) {
    return this.#indexLookup.has(key);
  }

  insert(key, value) {
    this.#elements.push({ key, value: Number.NEGATIVE_INFINITY });
    this.#indexLookup.set(key, this.size);

    this.update(key, value);
  }

  update(key, value) {
    let i = this.#indexLookup.get(key);
    let parent = this._parent(i);

    this.#elements[i].value = value;

    while (i > 1 && this.#comparator(this.#elements[parent], this.#elements[i]) < 0) {
      this._swap(parent, i);

      i = parent;
      parent = this._parent(i);
    }
  }

  _heapify(i) {
    let max = i;

    const left = this._left(i);

    if (left <= this.size && this.#comparator(this.#elements[left], this.#elements[i]) > 0) {
      max = left;
    }

    const right = this._right(i);

    if (right <= this.size && this.#comparator(this.#elements[right], this.#elements[i]) > 0) {
      max = right;
    }

    if (max !== i) {
      this._swap(max, i);

      this._heapify(max);
    }
  }

  _swap(i, j) {
    this.#indexLookup.set(this.#elements[i].key, j);
    this.#indexLookup.set(this.#elements[j].key, i);

    [this.#elements[i], this.#elements[j]] = [this.#elements[j], this.#elements[i]];
  }

  _parent(i) {
    return i >> 1;
  }

  _left(i) {
    return i << 1;
  }

  _right(i) {
    return (i << 1) + 1;
  }
}

class MinPriorityQueue extends PriorityQueue {
  constructor() {
    super((x, y) => y.value - x.value);
  }
}

class MaxPriorityQueue extends PriorityQueue {
  constructor() {
    super((x, y) => y.value - x.value);
  }
}

module.exports = {
  MaxPriorityQueue,
  MinPriorityQueue,
  PriorityQueue,
};
