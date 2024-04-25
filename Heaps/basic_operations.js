class MaxHeap {
  constructor(...items) {
    this.heap = [];

    items?.forEach((item) => this.insert(item));
  }

  insert(item) {
    this.heap.push(item);
    this.heapifyUp();
  }

  pop() {
    if (this.heap.length == 0) {
      return null;
    }

    if (this.heap.length == 1) {
      return this.heap.pop();
    }

    let lastIndex = this.heap.length - 1;
    [this.heap[0], this.heap[lastIndex]] = [this.heap[lastIndex], this.heap[0]];

    let maxItem = this.heap.pop();

    this.heapifyDown();
    return maxItem;
  }

  heapifyUp() {
    let index = this.heap.length - 1;

    while (this.hasParent(index) && this.getParent(index) < this.heap[index]) {
      let parentIndex = Math.floor((index - 1) / 2);
      [this.heap[parentIndex], this.heap[index]] = [
        this.heap[index],
        this.heap[parentIndex],
      ];

      index = parentIndex;
    }
  }

  heapifyDown() {
    let index = 0;
    let leftChildIndex = 2 * index + 1;
    let rightChildIndex = 2 * index + 2;

    while (
      this.heap[index] < this.heap[leftChildIndex] ||
      this.heap[index] < this.heap[rightChildIndex]
    ) {
      let largestChildIndex = leftChildIndex;

      if (this.heap[rightChildIndex] > this.heap[leftChildIndex]) {
        largestChildIndex = rightChildIndex;
      }

      [this.heap[index], this.heap[largestChildIndex]] = [
        this.heap[largestChildIndex],
        this.heap[index],
      ];

      index = largestChildIndex;
      leftChildIndex = 2 * index + 1;
      rightChildIndex = 2 * index + 2;
    }
  }

  hasParent(index) {
    let parentIndex = Math.floor((index - 1) / 2);
    return parentIndex >= 0;
  }

  getParent(index) {
    let parentIndex = Math.floor((index - 1) / 2);
    return this.heap[parentIndex];
  }

  peek() {
    return this.heap?.[0];
  }

  print() {
    console.log(this.heap);
  }
}

// const maxHeap = new MaxHeap(9, 7, 6, 5, 4);
const maxHeap = new MaxHeap(4, 10, 3, 5, 1);
maxHeap.print();
// maxHeap.insert(10);
// maxHeap.print();
// maxHeap.pop();
// maxHeap.print();

//       9

//    7       6
// 5     4

//       10

//    7       9
// 5     4  6

//       9

//    7       6
// 5     4
