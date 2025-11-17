const ArrayHeap = require("./arrayHeap");

function runTests(HeapClass) {
    describe(`Heap tests for ${HeapClass.name}`, () => {
        const isValidMinHeap = (arr) => {
            for (let i = 0; i < arr.length; i++) {
                const left = 2 * i + 1;
                const right = 2 * i + 2;
                if (left < arr.length && arr[i] > arr[left]) return false;
                if (right < arr.length && arr[i] > arr[right]) return false;
            }
            return true;
        }

        describe("Initialization", () => {
            it("should initialize an empty heap when no elements are provided", () => {
                const heap = new HeapClass();
                expect(heap.size()).toEqual(0);
            });

            it("should initialize an empty heap as min heap by default", () => {
                const heap = new HeapClass();
                expect(heap.isMaxHeap()).toEqual(false);
            });

            it("should initialize heap with elements when elements are provided", () => {
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
                arr.forEach(x => expect(x).toBe(5));
            });

            it("should maintain heap property after initialization", () => {
                const heap = new HeapClass(false, 5, 2, 8, 1, 7);

                const arr = heap.toArray();

                expect(isValidMinHeap(arr)).toBe(true);
            });

            it("should handle negative numbers, zeros, and mixed numbers", () => {
                const heap = new HeapClass(false, -10, 0, 5, -3, 8);

                expect(heap.size()).toEqual(5);

                const arr = heap.toArray();

                expect(isValidMinHeap(arr)).toBe(true);
            });
        });
    });
}

runTests(ArrayHeap)