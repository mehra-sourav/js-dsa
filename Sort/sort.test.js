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

// ---------- Stability detection ----------
 
// List of algorithms that are KNOWN to be unstable
// (theoretical property of the algorithm)
const UNSTABLE_SORTS = new Set(["Quick Sort"]);
 
// Detect if an implementation is stable in practice
function isStable(sortFn) {
  // All elements have the same "key" but different ids.
  // A stable sort must keep ids in the same relative order.
  const arr = [
    { key: 1, id: "a" },
    { key: 1, id: "b" },
    { key: 1, id: "c" },
    { key: 1, id: "d" },
  ];
 
  const originalOrder = arr.map((item) => item.id);
 
  // Our sorting functions compare items directly with <, >, <=.
  // For plain objects, JS compares their string forms, which are equal,
  // so "greater than" is always false. Stable algorithms won't swap them;
  // quick sort will move the pivot and change the order.
  sortFn(arr);

  const newOrder = arr.map((item) => item.id);
 
  if (originalOrder.length !== newOrder.length) return false;
 
  for (let i = 0; i < originalOrder.length; i++) {
    if (originalOrder[i] !== newOrder[i]) {
      return false; // relative order changed -> unstable
    }
  }
  return true;
}
 
function runStabilityTests(sortName, sortFn) {
  describe(`Stability tests for ${sortName}`, () => {
    test(
      `is ${UNSTABLE_SORTS.has(sortName) ? "unstable" : "stable"} as expected`,
      () => {
        const expectedStable = !UNSTABLE_SORTS.has(sortName);
        const actualStable = isStable(sortFn);
        
        expect(actualStable).toBe(expectedStable);
      }
    );
  });
}

// Register all sort implementations you want to test
runSortTests("Quick Sort", quickSort);

// Stability (uses name + internal UNSTABLE_SORTS list)
runStabilityTests("Quick Sort", quickSort);