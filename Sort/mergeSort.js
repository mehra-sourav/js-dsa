
const mergeSort = (arr) => {
    mergeSortHelper(arr, 0, arr.length - 1);
    return arr;
}

const mergeSortHelper = (arr, start, end) => {
    if (start >= end) return;
    
    const mid = Math.floor((start + end) / 2)

    mergeSortHelper(arr, start, mid);
    mergeSortHelper(arr, mid + 1, end);
    merge(arr, start, mid, end)
}

const merge = (arr, start, mid, end) => {
    // Lengths of the 2 portions to be merged
    const length1 = mid - start + 1;
    const length2 = end - mid;

    // Temporary arrays to store the left and right portions which are sorted already
    const leftArr = arr.slice(start, mid + 1);
    const rightArr = arr.slice(mid + 1, end + 1);

    // Indexes to keep track of iteration pointers of left and right subarrays and the array;
    let leftIdx = 0, rightIdx = 0, arrIdx = start;

    // Iterate over the subarrays till they have elements
    while (leftIdx < length1 && rightIdx < length2) {
        // Comparing elements of both sub arrays and inserting the smaller one first
        if (leftArr[leftIdx] <= rightArr[rightIdx]) {
            arr[arrIdx] = leftArr[leftIdx];
            arrIdx++;
            leftIdx++;
        }
        else {
            arr[arrIdx] = rightArr[rightIdx];
            arrIdx++;
            rightIdx++;
        }
    }

    // Put any leftover elements of subarrays into the array
    while (leftIdx < length1) {
        arr[arrIdx] = leftArr[leftIdx];
        arrIdx++;
        leftIdx++;
    }

    while (rightIdx < length2) {
        arr[arrIdx] = rightArr[rightIdx];
        arrIdx++;
        rightIdx++;
    }
}

module.exports = mergeSort;
