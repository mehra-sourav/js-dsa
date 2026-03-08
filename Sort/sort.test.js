const { quickSort } = require("./index.js");

function runSortTests(sortName, sortFn) {
  describe(`Sort tests for ${sortName}`, () => {
    const nativeSortNumbers = (arr) => [...arr].sort((a, b) => a - b);

    test("handles empty array", () => {
      const arr = [];
      sortFn(arr);
      expect(arr).toEqual([]);
    });

    test("handles single element", () => {
      const arr = [42];
      sortFn(arr);
      expect(arr).toEqual([42]);
    });

    test("sorts an already sorted array", () => {
      const arr = [1, 2, 3, 4, 5];
      sortFn(arr);
      expect(arr).toEqual([1, 2, 3, 4, 5]);
    });

    test("sorts a reverse-sorted array", () => {
      const arr = [5, 4, 3, 2, 1];
      sortFn(arr);
      expect(arr).toEqual([1, 2, 3, 4, 5]);
    });

    test("sorts array with duplicates", () => {
      const arr = [3, 1, 2, 3, 2, 1];
      sortFn(arr);
      expect(arr).toEqual([1, 1, 2, 2, 3, 3]);
    });

    test("sorts array with negative and positive numbers", () => {
      const arr = [0, -10, 5, -3, 8, 1];
      const expected = nativeSortNumbers(arr);
      sortFn(arr);
      expect(arr).toEqual(expected);
    });

    test("matches native sort on random arrays", () => {
      for (let i = 0; i < 20; i++) {
        const arr = Array.from({ length: 20 }, () =>
          Math.floor(Math.random() * 100 - 50)
        );
        const expected = nativeSortNumbers(arr);
        sortFn(arr);
        expect(arr).toEqual(expected);
      }
    });
  });
}

// Register all sort implementations you want to test
runSortTests("quickSort", quickSort);