
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


const quickSortHelper = (arr, left, right) => {
    if (left < right) {
        const pivotIndex = partition(arr, left, right);
        quickSortHelper(arr, left, pivotIndex - 1);
        quickSortHelper(arr, pivotIndex + 1, right);
    }
}


const quickSort = (arr) => {
    return quickSortHelper(arr, 0, arr.length - 1);
}

export { quickSort };