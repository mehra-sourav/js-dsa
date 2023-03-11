const { unsortedArrays } = require("./arrays.js");
const { bubbleSort, insertionSort, mergeSort } = require("./sort_functions.js");

let { arr1, arr2, arr3 } = unsortedArrays;
let unsortedArr1 = [...arr1],
  unsortedArr2 = [...arr2],
  unsortedArr3 = [...arr3];

function resetUnsortedArrays() {
  unsortedArr1 = [...arr1];
  unsortedArr2 = [...arr2];
  unsortedArr3 = [...arr3];
}

// Calling bubble sort
bubbleSort(unsortedArr1);
bubbleSort(unsortedArr2);
bubbleSort(unsortedArr3);

console.log("Sorted arrays after using bubble sort");
console.log(`\tArray 1: ${unsortedArr1}`);
console.log(`\tArray 2: ${unsortedArr2}`);
console.log(`\tArray 3: ${unsortedArr3}`);

console.log("\nResetting arrays");
resetUnsortedArrays();

console.log("Sorted array 1:", unsortedArr1);
console.log("Sorted array 2:", unsortedArr2);
console.log("Sorted array 3:", unsortedArr3);

// Calling insertion sort
insertionSort(unsortedArr1);
insertionSort(unsortedArr2);
insertionSort(unsortedArr3);

console.log("Sorted arrays after using insertion sort");
console.log(`\tArray 1: `, unsortedArr1);
console.log(`\tArray 2: `, unsortedArr2);
console.log(`\tArray 3: `, unsortedArr3);

console.log("\nResetting arrays");
resetUnsortedArrays();

// Calling merge sort
mergeSort(unsortedArr1);
mergeSort(unsortedArr2);
mergeSort(unsortedArr3);

console.log("Sorted arrays after using merge sort");
console.log(`\tArray 1: `, unsortedArr1);
console.log(`\tArray 2: `, unsortedArr2);
console.log(`\tArray 3: `, unsortedArr3);
