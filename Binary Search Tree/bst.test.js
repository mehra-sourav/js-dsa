const BST = require("./index");

describe("Binary Search Tree (BST)", () => {
  describe("Initialization & Basic State", () => {
    test("should initialize an empty tree when no items are provided", () => {
      const bst = new BST();
      expect(bst.root).toBe(null);
    });

    test("should initialize with items when provided in constructor", () => {
      const bst = new BST(10, 5, 15);
      expect(bst.search(10)).toBe(true);
      expect(bst.search(5)).toBe(true);
      expect(bst.search(15)).toBe(true);
    });

    test("isEmpty() should return true for empty tree", () => {
      const bst = new BST();
      expect(bst.isEmpty()).toBe(true);
    });

    test("isEmpty() should return false for non-empty tree", () => {
      const bst = new BST(10);
      expect(bst.isEmpty()).toBe(false);
    });

    test("size() should return 0 for empty tree", () => {
      const bst = new BST();
      expect(bst.size()).toBe(0);
    });

    test("size() should return correct count of nodes", () => {
      const bst = new BST(10, 5, 15);
      expect(bst.size()).toBe(3);
    });

    test("size() should update correctly after insertions", () => {
      const bst = new BST();
      expect(bst.size()).toBe(0);

      bst.insert(10);
      expect(bst.size()).toBe(1);

      bst.insert(5);
      expect(bst.size()).toBe(2);

      bst.insert(15);
      expect(bst.size()).toBe(3);
    });
  });

  describe("Insertion", () => {
    test("should insert a single value", () => {
      const bst = new BST();
      bst.insert(10);
      expect(bst.search(10)).toBe(true);
    });

    test("should insert multiple values maintaining BST property", () => {
      const bst = new BST();
      bst.insert(10);
      bst.insert(5);
      bst.insert(15);
      bst.insert(3);
      bst.insert(7);

      expect(bst.inOrderTraversal()).toEqual([3, 5, 7, 10, 15]);
    });

    test("should handle duplicate insertions gracefully", () => {
      const bst = new BST(10, 5, 5, 10);
      expect(bst.inOrderTraversal()).toEqual([5, 10]);
    });

    test("should insert negative numbers", () => {
      const bst = new BST();
      bst.insert(10);
      bst.insert(-5);
      bst.insert(15);

      expect(bst.search(-5)).toBe(true);
      expect(bst.inOrderTraversal()).toEqual([-5, 10, 15]);
    });

    test("should insert zero", () => {
      const bst = new BST();
      bst.insert(10);
      bst.insert(0);
      bst.insert(-10);

      expect(bst.search(0)).toBe(true);
      expect(bst.inOrderTraversal()).toEqual([-10, 0, 10]);
    });
  });

  describe("Search", () => {
    test("should find values that exist in the tree", () => {
      const bst = new BST(10, 5, 15, 3, 7, 12, 20);

      expect(bst.search(10)).toBe(true);
      expect(bst.search(5)).toBe(true);
      expect(bst.search(15)).toBe(true);
      expect(bst.search(3)).toBe(true);
      expect(bst.search(20)).toBe(true);
    });

    test("should return null for values not in the tree", () => {
      const bst = new BST(10, 5, 15);

      expect(bst.search(100)).toBe(null);
      expect(bst.search(-100)).toBe(null);
      expect(bst.search(0)).toBe(null);
    });

    test("should return null when searching empty tree", () => {
      const bst = new BST();
      expect(bst.search(10)).toBe(null);
    });

    test("findMin() should return the minimum value", () => {
      const bst = new BST(10, 5, 15, 3, 7, 12, 20);
      expect(bst.findMin()).toBe(3);
    });

    test("findMax() should return the maximum value", () => {
      const bst = new BST(10, 5, 15, 3, 7, 12, 20);
      expect(bst.findMax()).toBe(20);
    });

    test("findMin() should return null for empty tree", () => {
      const bst = new BST();
      expect(bst.findMin()).toBe(null);
    });

    test("findMax() should return null for empty tree", () => {
      const bst = new BST();
      expect(bst.findMax()).toBe(null);
    });
  });

  describe("Deletion", () => {
    test("delete() should remove a leaf node", () => {
      const bst = new BST(10, 5, 15);
      expect(bst.delete(5)).toBe(true);
      expect(bst.search(5)).toBe(null);
      expect(bst.search(10)).toBe(true);
      expect(bst.search(15)).toBe(true);
    });

    test("delete() should remove a node with one left child", () => {
      //      10
      //     /
      //    5
      //   /
      //  3
      const bst = new BST(10, 5, 3);
      expect(bst.delete(5)).toBe(true);
      expect(bst.search(5)).toBe(null);
      expect(bst.search(3)).toBe(true);
      expect(bst.search(10)).toBe(true);
      expect(bst.inOrderTraversal()).toEqual([3, 10]);
    });

    test("delete() should remove a node with one right child", () => {
      //   10
      //     \
      //      15
      //        \
      //         20
      const bst = new BST(10, 15, 20);
      expect(bst.delete(15)).toBe(true);
      expect(bst.search(15)).toBe(null);
      expect(bst.search(20)).toBe(true);
      expect(bst.search(10)).toBe(true);
      expect(bst.inOrderTraversal()).toEqual([10, 20]);
    });

    test("delete() should remove a node with two children", () => {
      //      10
      //     /  \
      //    5    15
      //   / \   /
      //  3   7 12
      const bst = new BST(10, 5, 15, 3, 7, 12);
      expect(bst.delete(5)).toBe(true);
      expect(bst.search(5)).toBe(null);
      // In-order should still be sorted
      expect(bst.inOrderTraversal()).toEqual([3, 7, 10, 12, 15]);
    });

    test("delete() should remove the root node", () => {
      const bst = new BST(10, 5, 15);
      expect(bst.delete(10)).toBe(true);
      expect(bst.search(10)).toBe(null);
      expect(bst.search(5)).toBe(true);
      expect(bst.search(15)).toBe(true);
      expect(bst.inOrderTraversal()).toEqual([5, 15]);
    });

    test("delete() should handle deleting from empty tree", () => {
      const bst = new BST();
      expect(bst.delete(10)).toBe(false);
    });

    test("delete() should return false when deleting non-existent value", () => {
      const bst = new BST(10, 5, 15);
      expect(bst.delete(100)).toBe(false);
      expect(bst.delete(-50)).toBe(false);
    });

    test("delete() should maintain BST property after deletion", () => {
      const bst = new BST(50, 30, 70, 20, 40, 60, 80);
      bst.delete(30);
      bst.delete(70);
      bst.delete(50);

      // Check in-order is still sorted
      const inOrder = bst.inOrderTraversal();
      expect(inOrder).toEqual([20, 40, 60, 80]);

      // Verify BST property: each element < next element
      for (let i = 0; i < inOrder.length - 1; i++) {
        expect(inOrder[i]).toBeLessThan(inOrder[i + 1]);
      }
    });
  });

  describe("Tree Properties", () => {
    describe("Height", () => {
      test("height() should return 0 for empty tree", () => {
        const bst = new BST();
        expect(bst.height()).toBe(0);
      });

      test("height() should return 1 for single node", () => {
        const bst = new BST(10);
        expect(bst.height()).toBe(1);
      });

      test("height() should return 2 for root with one child", () => {
        const bst = new BST(10, 5);
        expect(bst.height()).toBe(2);
      });

      test("height() should return correct height for balanced tree", () => {
        //      10
        //     /  \
        //    5    15
        //   / \   /
        //  3   7 12
        const bst = new BST(10, 5, 15, 3, 7, 12);
        expect(bst.height()).toBe(3);
      });

      test("height() should return correct height for skewed tree", () => {
        const bst = new BST();
        [1, 2, 3, 4, 5].forEach((v) => bst.insert(v));
        // 1 -> 2 -> 3 -> 4 -> 5 (chain of 5 nodes)
        expect(bst.height()).toBe(5);
      });
    });

    describe("Depth", () => {
      test("depth(value) should return depth of a node", () => {
        //      10 (depth 0)
        //     /  \
        //    5    15 (depth 1)
        //   /
        //  3 (depth 2)
        const bst = new BST(10, 5, 15, 3);
        expect(bst.depth(10)).toBe(0);
        expect(bst.depth(5)).toBe(1);
        expect(bst.depth(15)).toBe(1);
        expect(bst.depth(3)).toBe(2);
      });

      test("depth(value) should return -1 for non-existent node", () => {
        const bst = new BST(10, 5, 15);
        expect(bst.depth(100)).toBe(-1);
        expect(bst.depth(-50)).toBe(-1);
      });
    });
  });

  describe("Traversal", () => {
    describe("Pre-order Traversal", () => {
      test("should return empty array for empty tree", () => {
        const bst = new BST();
        expect(bst.preOrderTraversal()).toEqual([]);
      });

      test("should return correct pre-order traversal", () => {
        //      10
        //     /  \
        //    5    15
        //   / \   /
        //  3   7 12
        const bst = new BST(10, 5, 15, 3, 7, 12);
        // Pre-order: root, left, right -> 10, 5, 3, 7, 15, 12
        expect(bst.preOrderTraversal()).toEqual([10, 5, 3, 7, 15, 12]);
      });

      test("should handle single node tree", () => {
        const bst = new BST(42);
        expect(bst.preOrderTraversal()).toEqual([42]);
      });
    });

    describe("In-order Traversal", () => {
      test("should return empty array for empty tree", () => {
        const bst = new BST();
        expect(bst.inOrderTraversal()).toEqual([]);
      });

      test("should return sorted array for BST", () => {
        const bst = new BST(10, 5, 15, 3, 7, 12, 20);
        expect(bst.inOrderTraversal()).toEqual([3, 5, 7, 10, 12, 15, 20]);
      });

      test("should handle single node tree", () => {
        const bst = new BST(42);
        expect(bst.inOrderTraversal()).toEqual([42]);
      });
    });

    describe("Post-order Traversal", () => {
      test("should return empty array for empty tree", () => {
        const bst = new BST();
        expect(bst.postOrderTraversal()).toEqual([]);
      });

      test("should return correct post-order traversal", () => {
        //      10
        //     /  \
        //    5    15
        //   / \   /
        //  3   7 12
        const bst = new BST(10, 5, 15, 3, 7, 12);
        // Post-order: left, right, root -> 3, 7, 5, 12, 15, 10
        expect(bst.postOrderTraversal()).toEqual([3, 7, 5, 12, 15, 10]);
      });

      test("should handle single node tree", () => {
        const bst = new BST(42);
        expect(bst.postOrderTraversal()).toEqual([42]);
      });
    });

    describe("Level-order Traversal (BFS)", () => {
      test.todo(
        "levelOrderTraversal() should return empty array for empty tree",
      );
      test.todo(
        "levelOrderTraversal() should return correct level-order traversal",
      );
    });
  });

  describe("Advanced Operations", () => {
    describe("Successor and Predecessor", () => {
      test.todo("findSuccessor(value) should return the next greater value");
      test.todo("findSuccessor(value) should return null for maximum value");
      test.todo(
        "findSuccessor(value) should return null for non-existent value",
      );
      test.todo("findPredecessor(value) should return the next smaller value");
      test.todo("findPredecessor(value) should return null for minimum value");
      test.todo(
        "findPredecessor(value) should return null for non-existent value",
      );
    });

    describe("Kth Element", () => {
      test.todo("kthSmallest(k) should return the kth smallest element");
      test.todo("kthSmallest(k) should return null for invalid k");
      test.todo("kthLargest(k) should return the kth largest element");
      test.todo("kthLargest(k) should return null for invalid k");
    });

    describe("Range Queries", () => {
      test.todo("rangeQuery(low, high) should return values in range");
      test.todo(
        "rangeQuery(low, high) should return empty array if no values in range",
      );
      test.todo("rangeQuery(low, high) should handle swapped bounds");
    });
  });

  describe("Edge Cases", () => {
    test("should handle large number of insertions", () => {
      const bst = new BST();
      const values = Array.from({ length: 1000 }, (_, i) => i);
      values.forEach((v) => bst.insert(v));

      expect(bst.search(0)).toBe(true);
      expect(bst.search(500)).toBe(true);
      expect(bst.search(999)).toBe(true);
      expect(bst.search(1000)).toBe(null);
    });

    test("should handle skewed tree (all left insertions)", () => {
      const bst = new BST();
      [5, 4, 3, 2, 1].forEach((v) => bst.insert(v));

      expect(bst.inOrderTraversal()).toEqual([1, 2, 3, 4, 5]);
      expect(bst.preOrderTraversal()).toEqual([5, 4, 3, 2, 1]);
    });

    test("should handle skewed tree (all right insertions)", () => {
      const bst = new BST();
      [1, 2, 3, 4, 5].forEach((v) => bst.insert(v));

      expect(bst.inOrderTraversal()).toEqual([1, 2, 3, 4, 5]);
      expect(bst.preOrderTraversal()).toEqual([1, 2, 3, 4, 5]);
    });
  });
});
