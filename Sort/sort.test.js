const { unsortedArrays, sortedArrays } = require("./arrays.js");
const { bubbleSort, insertionSort, mergeSort } = require("./sort_functions.js");

const { arr1, arr2, arr3 } = unsortedArrays;

let unsortedArr1 = [...arr1],
  unsortedArr2 = [...arr2],
  unsortedArr3 = [...arr3];
const { arr1: sortedArr1, arr2: sortedArr2, arr3: sortedArr3 } = sortedArrays;

describe("Testing sorting algorithms", () => {
  beforeEach(() => {
    unsortedArr1 = [...arr1];
    unsortedArr2 = [...arr2];
    unsortedArr3 = [...arr3];
  });
  test("Bubble sort should sort the unsorted array", () => {
    bubbleSort(unsortedArr1);
    expect(unsortedArr1).toStrictEqual(sortedArr1);

    bubbleSort(unsortedArr2);
    expect(unsortedArr2).toEqual(sortedArr2);

    bubbleSort(unsortedArr3);
    expect(unsortedArr3).toEqual(sortedArr3);
  });

  test("Insertion sort should sort the unsorted array", () => {
    insertionSort(unsortedArr1);
    expect(unsortedArr1).toStrictEqual(sortedArr1);

    insertionSort(unsortedArr2);
    expect(unsortedArr2).toEqual(sortedArr2);

    insertionSort(unsortedArr3);
    expect(unsortedArr3).toEqual(sortedArr3);
  });

  test("Merge sort should sort the unsorted array", () => {
    mergeSort(unsortedArr1);
    expect(unsortedArr1).toStrictEqual(sortedArr1);

    mergeSort(unsortedArr2);
    expect(unsortedArr2).toEqual(sortedArr2);

    mergeSort(unsortedArr3);
    expect(unsortedArr3).toEqual(sortedArr3);
  });
});
