const { unsortedArrays, sortedArrays } = require("./arrays.js");
const { bubble_sort } = require("./bubble_sort.js");

const { arr1, arr2, arr3 } = unsortedArrays;

let unsortedArr1 = [...arr1],
  unsortedArr2 = [...arr2],
  unsortedArr3 = [...arr3];
const { arr1: sortedArr1, arr2: sortedArr2, arr3: sortedArr3 } = sortedArrays;

describe("Testing sorting algorithms", () => {
  test("Bubble sort should sort the unsorted array", () => {
    bubble_sort(unsortedArr1);
    expect(unsortedArr1).toStrictEqual(sortedArr1);

    bubble_sort(unsortedArr2);
    expect(unsortedArr2).toEqual(sortedArr2);

    bubble_sort(unsortedArr3);
    expect(unsortedArr3).toEqual(sortedArr3);
  });

  test("Insertion sort should sort the unsorted array", () => {
    bubble_sort(unsortedArr1);
    expect(unsortedArr1).toStrictEqual(sortedArr1);

    bubble_sort(unsortedArr2);
    expect(unsortedArr2).toEqual(sortedArr2);

    bubble_sort(unsortedArr3);
    expect(unsortedArr3).toEqual(sortedArr3);
  });
});
