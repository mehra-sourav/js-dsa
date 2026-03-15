/**
 * Function implementing Merge Sort (top-down recursive).
 * Splits the array into two halves, recursively sorts each half,
 * and then merges the sorted halves back together.
 *
 * !Time Complexity: O(nlogn)
 * !Space Complexity: O(n) additional space for temporary arrays
 *
 * @param {Array} arr - The array that needs to be sorted.
 * @returns {Array} The same array reference, sorted in non-decreasing order.
 */
const mergeSort = (arr) => {
    mergeSortHelper(arr, 0, arr.length - 1);
    return arr;
};

/**
 * Recursive helper that sorts the subarray arr[start..end] using merge sort.
 *
 * @param {Array} arr - The array being sorted in-place.
 * @param {number} start - Starting index of the current subarray (inclusive).
 * @param {number} end - Ending index of the current subarray (inclusive).
 */
const mergeSortHelper = (arr, start, end) => {
    // Base case: a subarray with 0 or 1 element is already sorted
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);

    // Recursively sort left half [start..mid] and right half [mid+1..end]
    mergeSortHelper(arr, start, mid);
    mergeSortHelper(arr, mid + 1, end);

    // Merge the two sorted halves back into arr
    merge(arr, start, mid, end);
};

/**
 * Merges two consecutive sorted subarrays of arr into a single sorted range.
 * The left subarray is arr[start..mid] and the right subarray is arr[mid+1..end].
 *
 * @param {Array} arr - The original array containing the two sorted halves.
 * @param {number} start - Starting index of the left half (inclusive).
 * @param {number} mid - Ending index of the left half (and mid point of the range).
 * @param {number} end - Ending index of the right half (inclusive).
 */
const merge = (arr, start, mid, end) => {
    // Lengths of the left and right halves to be merged
    const length1 = mid - start + 1;
    const length2 = end - mid;

    // Temporary arrays holding copies of the already-sorted left and right halves
    const leftArr = arr.slice(start, mid + 1);
    const rightArr = arr.slice(mid + 1, end + 1);

    // Indices pointing to the current element in leftArr, rightArr and the original array
    let leftIdx = 0;
    let rightIdx = 0;
    let arrIdx = start;

    // Merge while both halves still have elements remaining
    while (leftIdx < length1 && rightIdx < length2) {
        // Always take the smaller (or equal) element first to maintain stability
        if (leftArr[leftIdx] <= rightArr[rightIdx]) {
            arr[arrIdx] = leftArr[leftIdx];
            leftIdx++;
        } else {
            arr[arrIdx] = rightArr[rightIdx];
            rightIdx++;
        }
        arrIdx++;
    }

    // Copy any remaining elements from the left half
    while (leftIdx < length1) {
        arr[arrIdx] = leftArr[leftIdx];
        leftIdx++;
        arrIdx++;
    }

    // Copy any remaining elements from the right half
    while (rightIdx < length2) {
        arr[arrIdx] = rightArr[rightIdx];
        rightIdx++;
        arrIdx++;
    }
};

module.exports = mergeSort;
