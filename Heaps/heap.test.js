const ArrayHeap = require("./arrayHeap");

const isValidMinHeap = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    if (left < arr.length && arr[i] > arr[left]) return false;
    if (right < arr.length && arr[i] > arr[right]) return false;
  }
  return true;
};

const isValidMaxHeap = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    if (left < arr.length && arr[i] < arr[left]) return false;
    if (right < arr.length && arr[i] < arr[right]) return false;
  }
  return true;
};

function runTests(HeapClass) {
  describe(`Heap tests for ${HeapClass.name}`, () => {
    describe("Initialization", () => {
      it("should initialize an empty heap when no elements are provided", () => {
        const heap = new HeapClass();
        expect(heap.size()).toEqual(0);
      });

      it("should initialize an empty heap as min heap by default", () => {
        const heap = new HeapClass();
        expect(heap.isMaxHeap()).toEqual(false);
      });

      it("should initialize heap with elements", () => {
        const heap = new HeapClass(true, 1, 2, 3);
        expect(heap.size()).toEqual(3);
        expect(heap.toArray()).toEqual([3, 1, 2]);
      });

      it("peek should return null on empty heap", () => {
        const heap = new HeapClass();
        expect(heap.peek()).toBeNull(); // optional chaining in case peek not implemented yet
      });

      it("should handle duplicate elements correctly", () => {
        const heap = new HeapClass(true, 5, 5, 5, 5);

        expect(heap.size()).toEqual(4);

        const arr = heap.toArray();
        arr.forEach((x) => expect(x).toBe(5));
      });

      it("should maintain heap property after initialization", () => {
        const heap = new HeapClass(false, 5, 2, 8, 1, 7);

        const arr = heap.toArray();

        expect(isValidMinHeap(arr)).toBe(true);
      });

      it("should handle negative numbers, zeros and mixed numbers", () => {
        const heap = new HeapClass(false, -10, 0, 5, -3, 8);

        expect(heap.size()).toEqual(5);

        expect(isValidMinHeap(heap.toArray())).toBe(true);
      });

      it("should handle heap with single element", () => {
        const heap = new HeapClass(false, 42);
        expect(heap.size()).toEqual(1);
        expect(heap.peek()).toEqual(42);
        expect(heap.extract()).toEqual(42);
        expect(heap.size()).toEqual(0);
      });
    });
  });

  describe("Core Operations", () => {
    it("should insert elements and maintain heap order for sequential inserts", () => {
      const heap = new HeapClass(false);
      const values = [7, 3, 10, 5, 1];
      values.forEach((v) => heap.insert(v));
      expect(isValidMinHeap(heap.toArray())).toBe(true);
      expect(heap.size()).toEqual(values.length);
    });

    it("should extract min (root) each time and maintain heap property", () => {
      const heap = new HeapClass(false, 4, 2, 7, 1, 9);
      let sorted = [];
      while (heap.size() > 0) {
        sorted.push(heap.extract());
        expect(isValidMinHeap(heap.toArray())).toBe(true);
      }
      expect(sorted).toEqual([1, 2, 4, 7, 9]);
    });

    it("peek should not modify the heap", () => {
      const heap = new HeapClass(false, 3, 2, 5);
      const size = heap.size();
      const arrBefore = heap.toArray().slice();
      heap.peek();
      expect(isValidMinHeap(heap.toArray())).toBe(true);
      expect(heap.size()).toEqual(size);
      expect(heap.toArray()).toEqual(arrBefore);
    });

    it("clear should empty the heap", () => {
      const heap = new HeapClass(false, 1, 2, 3, 4, 5);
      heap.clear();
      expect(heap.size()).toEqual(0);
      expect(heap.peek()).toBeNull();
    });
  });

  describe("Bulk & Edge Cases", () => {
    it("should maintain heap property with large input arrays", () => {
      const values = Array.from({ length: 1000 }, () =>
        Math.floor(Math.random() * 10000)
      );
      const heap = new HeapClass(false, ...values);
      expect(isValidMinHeap(heap.toArray())).toBe(true);
    });

    it("should handle invalid inputs gracefully", () => {
      const heap = new HeapClass(false, undefined, null, NaN, 3, 2);
      expect(heap.size()).toBeGreaterThanOrEqual(2); // Only valid numbers inserted
      expect(isValidMinHeap(heap.toArray())).toBe(true);
    });
  });

  describe("Min Heap", () => {
    it("should maintain min-heap property after inserts", () => {
      const heap = new HeapClass(false);
      [7, 3, 9, 1, 6].forEach((n) => heap.insert(n));
      expect(isValidMinHeap(heap.toArray())).toBe(true);
    });

    it("should extract min values in order", () => {
      const values = [7, 3, 9, 1, 6];
      const heap = new HeapClass(false, ...values);
      let result = [];
      while (heap.size()) result.push(heap.extract());
      expect(result).toEqual([1, 3, 6, 7, 9]);
    });
  });

  describe("Max Heap", () => {
    it("should initialize as a max heap if specified", () => {
      const heap = new HeapClass(true);
      expect(heap.isMaxHeap()).toBe(true);
    });

    it("should maintain max-heap property after inserts", () => {
      const heap = new HeapClass(true);
      [2, 10, 4, 15, 1].forEach((n) => heap.insert(n));
      expect(isValidMaxHeap(heap.toArray())).toBe(true);
    });

    it("should extract max values in descending order", () => {
      const values = [2, 10, 4, 15, 1];
      const heap = new HeapClass(true, ...values);
      let result = [];
      while (heap.size()) result.push(heap.extract());
      expect(result).toEqual([15, 10, 4, 2, 1]);
    });

    it("should support peeking the max value", () => {
      const heap = new HeapClass(true, 1, 7, 12);
      expect(heap.peek()).toBe(12);
    });

    it("should handle duplicate max values correctly", () => {
      const heap = new HeapClass(true, 5, 5, 3, 5);
      expect(heap.size()).toBe(4);
      expect(isValidMaxHeap(heap.toArray())).toBe(true);
      let prev = heap.extract();
      while (heap.size()) {
        let curr = heap.extract();
        expect(prev).toBeGreaterThanOrEqual(curr);
        prev = curr;
      }
    });

    it("should handle negatives and mixed values (max-heap)", () => {
      const heap = new HeapClass(true, -5, 0, 7, -2, 3);
      expect(isValidMaxHeap(heap.toArray())).toBe(true);
    });
  });
}

runTests(ArrayHeap);
