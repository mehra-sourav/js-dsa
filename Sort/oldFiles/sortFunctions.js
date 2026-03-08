/**
 * Function implementing Bubble Sort
 * !Time Complexity: O(n^2)
 * !Space Complexity: O(1)
 * @param {Array} arr The array that needs to be sorted
 */
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    // i elements have already been places in their correct spot,
    // so no need of traversing over them again
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
}

/**
 * Function implementing Insertion Sort
 * !Time Complexity: O(n^2)
 * !Space Complexity: O(1)
 * @param {Array} arr The array that needs to be sorted
 */
function insertionSort(arr) {
  // Starting from index 1, and assuming subarray left to i is sorted
  for (let i = 1; i < arr.length; i++) {
    let j = i - 1,
      current = arr[i];
    // Moving element at ith index to it's place in the sorted left subarray
    // (if it belongs there)
    while (j > -1 && current < arr[j]) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current;
  }
}

/**
 * Function to merge two sorted halves of an array
 * !Time Complexity: O(n)
 * !Space Complexity: O(n)
 * @param {Array} arr The array that needs to be sorted
 */
function merge(arr, start, mid, end) {
  let leftLength = mid - start + 1,
    rightLength = end - (mid + 1) + 1;

  let leftArr = [],
    rightArr = [];

  // Temporarily assigning two halves of array to local arrays
  for (let i = 0; i < leftLength; i++) {
    leftArr.push(arr[start + i]);
  }

  for (let j = 0; j < rightLength; j++) {
    rightArr.push(arr[mid + 1 + j]);
  }

  let leftArrIdx = 0,
    rightArrIdx = 0,
    arrIdx = start;

  // Merging the two halves and putting each element into it's correct place
  // in the array
  while (leftArrIdx < leftLength && rightArrIdx < rightLength) {
    if (leftArr[leftArrIdx] <= rightArr[rightArrIdx]) {
      arr[arrIdx] = leftArr[leftArrIdx];
      leftArrIdx++;
    } else {
      arr[arrIdx] = rightArr[rightArrIdx];
      rightArrIdx++;
    }
    arrIdx++;
  }

  // Putting the left over elements into the array

  while (leftArrIdx < leftLength) {
    arr[arrIdx] = leftArr[leftArrIdx];
    arrIdx++;
    leftArrIdx++;
  }

  while (rightArrIdx < rightLength) {
    arr[arrIdx] = rightArr[rightArrIdx];
    arrIdx++;
    rightArrIdx++;
  }
}

/**
 * Function implementing Merge Sort
 * !Time Complexity: O(nlogn)
 * !Space Complexity: O(n)
 * @param {Array} arr The array that needs to be sorted
 */
function mergeSort(arr, start = 0, end = arr.length - 1) {
  if (start >= end) return;

  // Calculate mid point of array
  let mid = Math.floor((start + end) / 2);

  // Call mergeSort recursively on both halves
  mergeSort(arr, start, mid);
  mergeSort(arr, mid + 1, end);

  // Merge the sorted halves
  merge(arr, start, mid, end);
}

module.exports = { bubbleSort, insertionSort, mergeSort };
