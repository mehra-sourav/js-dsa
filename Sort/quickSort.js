/**
 * Function implementing Quick Sort using the last element as pivot.
 * !Time Complexity: Average O(nlogn), Worst O(n^2) (when the smallest or largest 
 * element is always chosen as pivot in a sorted array)
 * !Space Complexity: O(logn) due to recursion (call stack)
 * @param {Array} arr The array that needs to be sorted (sorted in-place).
 */
const quickSort = (arr) => {
    quickSortHelper(arr, 0, arr.length - 1);
    return arr;
}

/**
 * Recursive helper for Quick Sort.
 * Partitions the array and recursively sorts the left and right subarrays.
 * @param {Array} arr The array to sort (modified in-place).
 * @param {number} left Left index of the current subarray.
 * @param {number} right Right index of the current subarray.
 */
const quickSortHelper = (arr, left, right) => {
    // If there portion of the array has one or zero elements, it's already sorted
    if (left >= right) return;

    const pivotIndex = partition(arr, left, right);
    quickSortHelper(arr, left, pivotIndex - 1);
    quickSortHelper(arr, pivotIndex + 1, right);
}

/**
 * Partition function for Quick Sort (Lomuto partition scheme).
 * Chooses the rightmost element as pivot and places it in its correct position
 * so that all smaller elements are to its left and greater elements to its right.
 * @param {Array} arr The array being partitioned.
 * @param {number} left Left index of the partition range.
 * @param {number} right Right index of the partition range (pivot position).
 * @returns {number} The final index of the pivot after partitioning.
 */
const partition = (arr, left, right) => {
    if (left === right) return left;

    let pivot = arr[right];
    let pivotIndex = left - 1;

    // Iterating through the array and comparing each element with the pivot and 
    // swapping the elements if the current element is less than the pivot
    for (let i = left; i < right; i++) {
        const currentElement = arr[i];
        if (currentElement < pivot) {
            pivotIndex++;
            [arr[pivotIndex], arr[i]] = [arr[i], arr[pivotIndex]];
        }
    }
    // Swapping the pivot element with the element at the pivot index
    [arr[pivotIndex + 1], arr[right]] = [arr[right], arr[pivotIndex + 1]];

    return pivotIndex + 1;
}

module.exports = quickSort;