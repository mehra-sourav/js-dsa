class ArrayHeap {
  constructor(...items) {
    this.heap = [];

    this.maxHeap = !!items[0] ?? false;

    items?.slice(1)?.forEach((item) => {
      if (typeof item === "number" && !Number.isNaN(item)) {
        this.insert(item);
      }
    });
  }

  insert(item) {
    this.heap.push(item);
    this.#heapifyUp();
  }

  extract() {
    let rootIdx = 0,
      lastIdx = this.heap.length - 1;

    // Swapping items at root and last node
    if (rootIdx !== lastIdx) {
      this.#swap(rootIdx, lastIdx);
    }

    // Deleting the root element which is now at end
    const extractedElement = this.heap.pop();

    this.#heapifyDown();

    return extractedElement;
  }

  #heapifyUp() {
    let elementIdx = this.heap.length - 1;

    // Checking if a parent should be swapped with child
    while (
      this.#hasParent(elementIdx) &&
      !this.#compare(this.#getParent(elementIdx), this.heap[elementIdx])
    ) {
      const parentIdx = this.#getParentIdx(elementIdx);
      this.#swap(parentIdx, elementIdx);
      elementIdx = parentIdx;
    }
  }

  #heapifyDown() {
    let parentIdx = 0;

    while (this.#hasLeftChild(parentIdx)) {
      const leftChildIdx = 2 * parentIdx + 1;
      const rightChildIdx = 2 * parentIdx + 2;

      // Assume the left child is the best replacement candidate
      let replacementIdx = leftChildIdx;

      // If right child exists, see if it is a better replacement than left
      if (
        this.#hasRightChild(parentIdx) &&
        !this.#compare(this.heap[replacementIdx], this.heap[rightChildIdx])
      ) {
        replacementIdx = rightChildIdx;
      }

      // Only replace if the candidate is better suited than the parent
      if (this.#compare(this.heap[parentIdx], this.heap[replacementIdx])) {
        break;
      }

      this.#swap(parentIdx, replacementIdx);
      parentIdx = replacementIdx;
    }
  }

  #hasParent(index) {
    let parentIndex = Math.floor((index - 1) / 2);
    return parentIndex >= 0;
  }

  #hasLeftChild(index) {
    let leftChildIdx = 2 * index + 1;
    return leftChildIdx < this.heap.length;
  }

  #hasRightChild(index) {
    let rightChildIdx = 2 * index + 2;
    return rightChildIdx < this.heap.length;
  }

  #getParentIdx(index) {
    const parentIdx = Math.floor((index - 1) / 2);
    return parentIdx;
  }

  #getParent(index) {
    const parentIdx = Math.floor((index - 1) / 2);
    return this.heap[parentIdx];
  }

  #swap(sourceIdx, toIdx) {
    [this.heap[sourceIdx], this.heap[toIdx]] = [
      this.heap[toIdx],
      this.heap[sourceIdx],
    ];
  }

  #compare(parent, child) {
    if (this.maxHeap) {
      return parent > child;
    } else {
      return parent < child;
    }
  }

  clear() {
    this.heap = [];
  }

  isMaxHeap() {
    return this.maxHeap;
  }

  peek() {
    return this.size() > 0 ? this.heap[0] : null;
  }

  size() {
    return this.heap.length;
  }

  toArray() {
    return this.heap;
  }
}

module.exports = ArrayHeap;
