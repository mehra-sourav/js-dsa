class ArrayHeap {
    constructor(...items) {
        this.heap = [];

        this.maxHeap = !!items[0] ?? false;

        items?.slice(1)?.forEach(item => {
            this.insert(item)
        })
    }

    insert(item) {
        this.heap.push(item)
        this.#heapifyUp()
    }

    #heapifyUp() {
        let elementIdx = this.heap.length - 1

        // Checking if a parent should be swapped with child
        while (this.#hasParent(elementIdx) && !this.#compare(this.#getParent(elementIdx), this.heap[elementIdx])) {
            const parentIdx = this.#getParentIdx(elementIdx)
            this.#swap(parentIdx, elementIdx)
            elementIdx = parentIdx;
        }
    }

    #hasParent(index) {
        let parentIndex = Math.floor((index - 1) / 2);
        return parentIndex >= 0;
    }

    #getParentIdx(index) {
        const parentIdx = Math.floor((index - 1) / 2)
        return parentIdx
    }
    
    #getParent(index) {
        const parentIdx = Math.floor((index - 1) / 2)
        return this.heap[parentIdx];
    }

    #swap(sourceIdx, toIdx) {
        [this.heap[sourceIdx], this.heap[toIdx]] = [this.heap[toIdx], this.heap[sourceIdx]];
    }

    #compare(parent, child) {
        if (this.maxHeap) {
            return parent > child
        }
        else {
            return parent < child
        }
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