/**
 * Function implementing Linear Search
 * !Time Complexity: O(n)
 * !Space Complexity: O(1)
 * @param {Array} arr The array over in which the item needs to be searched
 * @param {Number} item The item that needs to be searched
 * @returns {Number} The index where the element is found in the array
 */
function linearSearch(arr, item) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == item) {
      return i;
    }
  }
  return -1;
}

/**
 * Function implementing Recursive Binary Search
 * !Time Complexity: O(logn)
 * !Space Complexity: O(logn)
 * @param {Array} arr The array over in which the item needs to be searched
 * @param {Number} item The item that needs to be searched
 * @returns {Number} The index where the element is found in the array
 */
function recursiveBinarySearch(arr, start, end, item) {
  if (start >= end) {
    return -1;
  }

  let mid = Math.floor((start + end) / 2);

  if (arr[mid] == item) {
    return mid;
  } else if (item < arr[mid]) {
    return recursiveBinarySearch(arr, start, mid, item);
  } else {
    return recursiveBinarySearch(arr, mid + 1, end, item);
  }
}

/**
 * Function implementing Iterative Binary Search
 * !Time Complexity: O(logn)
 * !Space Complexity: O(1)
 * @param {Array} arr The array over in which the item needs to be searched
 * @param {Number} item The item that needs to be searched
 * @returns {Number} The index where the element is found in the array
 */
function iterativeBinarySearch(arr, item) {
  let start = 0,
    end = arr.length - 1;

  while (start < end) {
    let mid = Math.floor((start + end) / 2);

    if (arr[mid] == item) {
      return mid;
    } else if (item < arr[mid]) {
      end = mid;
    } else {
      start = mid + 1;
    }
  }
  return -1;
}

module.exports = { linearSearch, recursiveBinarySearch, iterativeBinarySearch };
