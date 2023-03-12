const { sortedArrays } = require("../arrays.js");
const {
  linearSearch,
  recursiveBinarySearch,
  iterativeBinarySearch,
} = require("./searchFunctions.js");

const { arr1, arr2, arr3 } = sortedArrays;
const searchItemsArr1 = [
  [1, -1],
  [-1428, 3],
  [3392, 7],
];
const searchItemsArr2 = [
  [-8351, 1],
  [369, 4],
  [1, -1],
];
const searchItemsArr3 = [
  [-4673, 2],
  [-864, -1],
  [4931, 7],
];

describe("Testing linear, recursive binary and iterative binary search algorithms", () => {
  // Tests for linear search
  test("Linear search should return the correct indexes for the searched items", () => {
    searchItemsArr1.forEach(([searchItem, expectedPosition]) => {
      let itemPosInArray = linearSearch(arr1, searchItem);
      expect(itemPosInArray).toBe(expectedPosition);
    });

    searchItemsArr2.forEach(([searchItem, expectedPosition]) => {
      let itemPosInArray = linearSearch(arr2, searchItem);
      expect(itemPosInArray).toBe(expectedPosition);
    });

    searchItemsArr3.forEach(([searchItem, expectedPosition]) => {
      let itemPosInArray = linearSearch(arr3, searchItem);
      expect(itemPosInArray).toBe(expectedPosition);
    });
  });

  // Tests for iterative binary search
  test("Iterative binary search should return the correct indexes for the searched items", () => {
    searchItemsArr1.forEach(([searchItem, expectedPosition]) => {
      let itemPosInArray = iterativeBinarySearch(arr1, searchItem);
      expect(itemPosInArray).toBe(expectedPosition);
    });

    searchItemsArr2.forEach(([searchItem, expectedPosition]) => {
      let itemPosInArray = iterativeBinarySearch(arr2, searchItem);
      expect(itemPosInArray).toBe(expectedPosition);
    });

    searchItemsArr3.forEach(([searchItem, expectedPosition]) => {
      let itemPosInArray = iterativeBinarySearch(arr3, searchItem);
      expect(itemPosInArray).toBe(expectedPosition);
    });
  });

  // Tests for recursive binary search
  test("Recursive binary search should return the correct indexes for the searched items", () => {
    searchItemsArr1.forEach(([searchItem, expectedPosition]) => {
      let itemPosInArray = recursiveBinarySearch(
        arr1,
        0,
        arr1.length - 1,
        searchItem
      );
      expect(itemPosInArray).toBe(expectedPosition);
    });

    searchItemsArr2.forEach(([searchItem, expectedPosition]) => {
      let itemPosInArray = recursiveBinarySearch(
        arr2,
        0,
        arr2.length - 1,
        searchItem
      );
      expect(itemPosInArray).toBe(expectedPosition);
    });

    searchItemsArr3.forEach(([searchItem, expectedPosition]) => {
      let itemPosInArray = recursiveBinarySearch(
        arr3,
        0,
        arr3.length - 1,
        searchItem
      );
      expect(itemPosInArray).toBe(expectedPosition);
    });
  });
});
