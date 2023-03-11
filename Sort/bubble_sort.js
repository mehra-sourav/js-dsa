const { unsortedArrays } = require("./arrays.js");

let { arr1, arr2, arr3 } = unsortedArrays;
const unsortedArr1 = [...arr1],
  unsortedArr2 = [...arr2],
  unsortedArr3 = [...arr3];

function bubble_sort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
}

bubble_sort(unsortedArr1);
bubble_sort(unsortedArr2);
bubble_sort(unsortedArr3);

console.log("Sorted array 1:", unsortedArr1);
console.log("Sorted array 2:", unsortedArr2);
console.log("Sorted array 3:", unsortedArr3);

module.exports = { bubble_sort };
