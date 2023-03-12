const { sortedArrays } = require("../arrays.js");
const {
  linearSearch,
  recursiveBinarySearch,
  iterativeBinarySearch,
} = require("./searchFunctions.js");

const { arr1, arr2, arr3 } = sortedArrays;
const searchItemsArr1 = [1, -1428, 3392];
const searchItemsArr2 = [-8351, 369, 1];
const searchItemsArr3 = [-4673, -864, 4931];

console.log("Searching items in first array");
for (let searchItem of searchItemsArr1) {
  console.log(
    `\tIndex of ${searchItem} in array1 using Linear Search: ${linearSearch(
      arr1,
      searchItem
    )}`
  );
  console.log(
    `\tIndex of ${searchItem} in array1 using Iterative Binary Search: ${iterativeBinarySearch(
      arr1,
      searchItem
    )}`
  );
  console.log(
    `\tIndex of ${searchItem} in array1 using Recursive Binary Search: ${recursiveBinarySearch(
      arr1,
      0,
      arr1.length - 1,
      searchItem
    )}\n`
  );
}

console.log("Searching items in second array");
for (let searchItem of searchItemsArr2) {
  console.log(
    `\tIndex of ${searchItem} in array2 using Linear Search: ${linearSearch(
      arr2,
      searchItem
    )}`
  );
  console.log(
    `\tIndex of ${searchItem} in array2 using Iterative Binary Search: ${iterativeBinarySearch(
      arr2,
      searchItem
    )}`
  );
  console.log(
    `\tIndex of ${searchItem} in array2 using Recursive Binary Search: ${recursiveBinarySearch(
      arr2,
      0,
      arr2.length - 1,
      searchItem
    )}\n`
  );
}

console.log("Searching items in third array");
for (let searchItem of searchItemsArr3) {
  console.log(
    `\tIndex of ${searchItem} in array3 using Linear Search: ${linearSearch(
      arr3,
      searchItem
    )}`
  );
  console.log(
    `\tIndex of ${searchItem} in array3 using Iterative Binary Search: ${iterativeBinarySearch(
      arr3,
      searchItem
    )}`
  );
  console.log(
    `\tIndex of ${searchItem} in array3 using Recursive Binary Search: ${recursiveBinarySearch(
      arr3,
      0,
      arr3.length - 1,
      searchItem
    )}\n`
  );
}
