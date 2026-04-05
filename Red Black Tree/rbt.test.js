const RBT = require("./index");

describe("Red Black Tree (RBT)", () => {
  describe("Initialization & Basic State", () => {
    test("should initialize an empty tree when no items are provided", () => {
      const rbt = new RBT();
      expect(rbt.root).toBe(null);
    });

    test("root node should be black after single node insertion", () => {
      //   10(B)
      const rbt = new RBT(10);
      expect(rbt.root.color).toBe("BLACK");
    });

    test("root node should be black after multiple node insertion", () => {
      //       20(B)
      //      /    \
      //   10(R)  30(R)
      const rbt = new RBT(10, 20, 30);
      expect(rbt.root.color).toBe("BLACK");
    });

    test("should initialize with items when provided in constructor", () => {
      //       10(B)
      //      /    \
      //    5(R)  15(R)
      const rbt = new RBT(10, 5, 15);
      expect(rbt.search(10)).toBe(true);
      expect(rbt.search(5)).toBe(true);
      expect(rbt.search(15)).toBe(true);
    });

    test("isEmpty() should return true for empty tree", () => {
      const rbt = new RBT();
      expect(rbt.isEmpty()).toBe(true);
    });

    test("isEmpty() should return false for non-empty tree", () => {
      const rbt = new RBT(10);
      expect(rbt.isEmpty()).toBe(false);
    });

    test("size() should return 0 for empty tree", () => {
      const rbt = new RBT();
      expect(rbt.size()).toBe(0);
    });

    test("size() should return correct count of nodes", () => {
      //       10(B)
      //      /    \
      //    5(R)  15(R)
      const rbt = new RBT(10, 5, 15);
      expect(rbt.size()).toBe(3);
    });

    test("size() should update correctly after insertions", () => {
      const rbt = new RBT();
      expect(rbt.size()).toBe(0);
      expect(rbt.height()).toBe(0);

      //   10(B)
      rbt.insert(10);
      expect(rbt.size()).toBe(1);
      expect(rbt.height()).toBe(1);

      //     10(B)
      //    /
      //   5(R)
      rbt.insert(5);
      expect(rbt.size()).toBe(2);
      expect(rbt.height()).toBe(2);

      //       10(B)
      //      /    \
      //    5(R)  15(R)
      rbt.insert(15);
      expect(rbt.size()).toBe(3);
      expect(rbt.height()).toBe(2);
    });

    // test("size() should decrease after deletions", () => {
    //   const bst = new BST(10, 5, 15, 3, 7);
    //   expect(bst.size()).toBe(5);

    //   bst.delete(3); // Delete leaf
    //   expect(bst.size()).toBe(4);

    //   bst.delete(5); // Delete node with one child
    //   expect(bst.size()).toBe(3);

    //   bst.delete(10); // Delete root with two children
    //   expect(bst.size()).toBe(2);

    //   // Cross-check: height updates after deletions
    //   expect(bst.height()).toBe(2);
    // });

    // test("isEmpty() should become true after deleting all nodes", () => {
    //   const bst = new BST(10, 5, 15);
    //   expect(bst.isEmpty()).toBe(false);

    //   bst.delete(10);
    //   bst.delete(5);
    //   bst.delete(15);

    //   expect(bst.isEmpty()).toBe(true);
    //   expect(bst.size()).toBe(0);
    //   expect(bst.height()).toBe(0);
    // });
  });

  describe("Insertion", () => {
    test("insertFixup should recolor nodes to restore RB tree invariants", () => {
      const rbt = new RBT();
      //   3(B)
      rbt.insert(3);

      expect(rbt.root.color).toBe("BLACK");

      //     3(B)
      //    /
      //   1(R)
      rbt.insert(1);

      expect(rbt.root.value).toBe(3);
      expect(rbt.root.color).toBe("BLACK");
      expect(rbt.root.left.value).toBe(1);
      expect(rbt.root.left.color).toBe("RED");

      //       3(B)
      //      /    \
      //    1(R)  4(R)
      rbt.insert(4);

      expect(rbt.root.value).toBe(3);
      expect(rbt.root.color).toBe("BLACK");
      expect(rbt.root.left.value).toBe(1);
      expect(rbt.root.left.color).toBe("RED");
      expect(rbt.root.right.value).toBe(4);
      expect(rbt.root.right.color).toBe("RED");

      //       3(B)              Recolor (uncle 1 is RED)
      //      /    \       →    5(R) under 4(R), uncle 1(R)
      //    1(B)  4(B)          → recolor 1(B), 4(B), 3(B stays root)
      //            \
      //           5(R)
      rbt.insert(5);

      expect(rbt.root.value).toBe(3);
      expect(rbt.root.color).toBe("BLACK");
      expect(rbt.root.left.value).toBe(1);
      expect(rbt.root.left.color).toBe("BLACK");
      expect(rbt.root.right.value).toBe(4);
      expect(rbt.root.right.color).toBe("BLACK");
      expect(rbt.root.right.right.value).toBe(5);
      expect(rbt.root.right.right.color).toBe("RED");

      //       3(B)
      //      /    \
      //    1(B)  4(B)
      //         / \
      //      3.5(R) 5(R)
      rbt.insert(3.5);

      expect(rbt.root.value).toBe(3);
      expect(rbt.root.color).toBe("BLACK");
      expect(rbt.root.left.value).toBe(1);
      expect(rbt.root.left.color).toBe("BLACK");
      expect(rbt.root.right.value).toBe(4);
      expect(rbt.root.right.color).toBe("BLACK");
      expect(rbt.root.right.left.value).toBe(3.5);
      expect(rbt.root.right.left.color).toBe("RED");
      expect(rbt.root.right.right.value).toBe(5);
      expect(rbt.root.right.right.color).toBe("RED");

      //         3(B)              Recolor (uncle 3.5 is RED)
      //        /    \       →    6(R) under 5(R), uncle 3.5(R)
      //      1(B)  4(R)          → recolor 3.5(B), 5(B), 4(R)
      //           /    \         4(R) under 3(B) → ok
      //        3.5(B) 5(B)
      //                 \
      //                6(R)
      rbt.insert(6);

      expect(rbt.root.value).toBe(3);
      expect(rbt.root.color).toBe("BLACK");
      expect(rbt.root.left.value).toBe(1);
      expect(rbt.root.left.color).toBe("BLACK");
      expect(rbt.root.right.value).toBe(4);
      expect(rbt.root.right.color).toBe("RED");
      expect(rbt.root.right.left.value).toBe(3.5);
      expect(rbt.root.right.left.color).toBe("BLACK");
      expect(rbt.root.right.right.value).toBe(5);
      expect(rbt.root.right.right.color).toBe("BLACK");
      expect(rbt.root.right.right.right.value).toBe(6);
      expect(rbt.root.right.right.right.color).toBe("RED");

      //         3(B)
      //        /    \
      //      1(B)  4(R)
      //           /    \
      //        3.5(B) 5(B)
      //              / \
      //           4.5(R) 6(R)
      rbt.insert(4.5);

      expect(rbt.root.value).toBe(3);
      expect(rbt.root.color).toBe("BLACK");
      expect(rbt.root.left.value).toBe(1);
      expect(rbt.root.left.color).toBe("BLACK");
      expect(rbt.root.right.value).toBe(4);
      expect(rbt.root.right.color).toBe("RED");
      expect(rbt.root.right.left.value).toBe(3.5);
      expect(rbt.root.right.left.color).toBe("BLACK");
      expect(rbt.root.right.right.value).toBe(5);
      expect(rbt.root.right.right.color).toBe("BLACK");
      expect(rbt.root.right.right.left.value).toBe(4.5);
      expect(rbt.root.right.right.left.color).toBe("RED");
      expect(rbt.root.right.right.right.value).toBe(6);
      expect(rbt.root.right.right.right.color).toBe("RED");

      //   rbt.insert(7);

      //   expect(rbt.root.value).toBe(3);
      //   expect(rbt.root.color).toBe("BLACK");
      //   expect(rbt.root.left.value).toBe(1);
      //   expect(rbt.root.left.color).toBe("BLACK");
      //   expect(rbt.root.right.value).toBe(4);
      //   expect(rbt.root.right.color).toBe("BLACK");
      //   expect(rbt.root.right.left.value).toBe(3.5);
      //   expect(rbt.root.right.left.color).toBe("BLACK");
      //   expect(rbt.root.right.right.value).toBe(5);
      //   expect(rbt.root.right.right.color).toBe("RED");
      //   expect(rbt.root.right.right.left.value).toBe(4.5);
      //   expect(rbt.root.right.right.left.color).toBe("BLACK");
      //   expect(rbt.root.right.right.right.value).toBe(6);
      //   expect(rbt.root.right.right.right.color).toBe("BLACK");
      //   expect(rbt.root.right.right.right.right.value).toBe(7);
      //   expect(rbt.root.right.right.right.right.color).toBe("RED");
    });

    test("insertFixup should right rotate and recolor for Left-Left red-red violation", () => {
      //       30(B)                 After insert 5:
      //      /    \                 uncle 40 is RED → recolor
      //   10(B)  40(B)              10(B), 40(B), 30(B stays root)
      //   /
      //  5(R)
      const rbt = new RBT(30, 10, 40, 5);

      expect(rbt.root.value).toBe(30);
      expect(rbt.root.color).toBe("BLACK");
      expect(rbt.root.left.value).toBe(10);
      expect(rbt.root.left.color).toBe("BLACK");
      expect(rbt.root.right.value).toBe(40);
      expect(rbt.root.right.color).toBe("BLACK");
      expect(rbt.root.left.left.value).toBe(5);
      expect(rbt.root.left.left.color).toBe("RED");

      //       30(B)               1(R) under 5(R) → LL violation
      //      /    \               uncle = null(B)
      //    5(B)  40(B)            → right rotate 10, recolor:
      //   / \                      5(B), 10→RED
      //  1(R) 10(R)
      rbt.insert(1);

      expect(rbt.root.value).toBe(30);
      expect(rbt.root.color).toBe("BLACK");
      expect(rbt.root.left.value).toBe(5);
      expect(rbt.root.left.color).toBe("BLACK");
      expect(rbt.root.right.value).toBe(40);
      expect(rbt.root.right.color).toBe("BLACK");

      expect(rbt.root.left.left.value).toBe(1);
      expect(rbt.root.left.left.color).toBe("RED");
      expect(rbt.root.left.right.value).toBe(10);
      expect(rbt.root.left.right.color).toBe("RED");
    });

    test("insertFixup should left rotate and recolor for Right-Right red-red violation", () => {
      //       30(B)                 After insert 50:
      //      /    \                 uncle 10 is RED → recolor
      //   10(B)  40(B)              10(B), 40(B), 30(B stays root)
      //            \
      //           50(R)
      const rbt = new RBT(30, 10, 40, 50);

      expect(rbt.root.value).toBe(30);
      expect(rbt.root.color).toBe("BLACK");
      expect(rbt.root.left.value).toBe(10);
      expect(rbt.root.left.color).toBe("BLACK");
      expect(rbt.root.right.value).toBe(40);
      expect(rbt.root.right.color).toBe("BLACK");
      expect(rbt.root.right.right.value).toBe(50);
      expect(rbt.root.right.right.color).toBe("RED");

      //       30(B)               60(R) under 50(R) → RR violation
      //      /    \               uncle = null(B)
      //   10(B)  50(B)            → left rotate 40, recolor:
      //         / \                 50(B), 40→RED
      //      40(R) 60(R)
      rbt.insert(60);

      expect(rbt.root.value).toBe(30);
      expect(rbt.root.color).toBe("BLACK");
      expect(rbt.root.left.value).toBe(10);
      expect(rbt.root.left.color).toBe("BLACK");

      expect(rbt.root.right.value).toBe(50);
      expect(rbt.root.right.color).toBe("BLACK");
      expect(rbt.root.right.left.value).toBe(40);
      expect(rbt.root.right.left.color).toBe("RED");
      expect(rbt.root.right.right.value).toBe(60);
      expect(rbt.root.right.right.color).toBe("RED");
    });

    test("insertFixup should left-then-right rotate for Left-Right triangle case", () => {
      //       30(B)                 After insert 5:
      //      /    \                 uncle 40 is RED → recolor
      //   10(B)  40(B)              10(B), 40(B), 30(B stays root)
      //   /
      //  5(R)
      const rbt = new RBT(30, 10, 40, 5);

      expect(rbt.root.value).toBe(30);
      expect(rbt.root.color).toBe("BLACK");
      expect(rbt.root.left.value).toBe(10);
      expect(rbt.root.left.color).toBe("BLACK");
      expect(rbt.root.right.value).toBe(40);
      expect(rbt.root.right.color).toBe("BLACK");
      expect(rbt.root.left.left.value).toBe(5);
      expect(rbt.root.left.left.color).toBe("RED");

      //       30(B)               6(R) under 5(R) right → LR violation
      //      /    \               uncle = null(B)
      //    6(B)  40(B)            → left rotate 5, right rotate 10
      //   / \                      recolor: 6(B), 10→RED
      //  5(R) 10(R)
      rbt.insert(6);

      expect(rbt.root.value).toBe(30);
      expect(rbt.root.color).toBe("BLACK");
      expect(rbt.root.left.value).toBe(6);
      expect(rbt.root.left.color).toBe("BLACK");
      expect(rbt.root.right.value).toBe(40);
      expect(rbt.root.right.color).toBe("BLACK");

      expect(rbt.root.left.left.value).toBe(5);
      expect(rbt.root.left.left.color).toBe("RED");
      expect(rbt.root.left.right.value).toBe(10);
      expect(rbt.root.left.right.color).toBe("RED");
    });

    test("insertFixup should right-then-left rotate for Right-Left triangle case", () => {
      //       30(B)                 After insert 50:
      //      /    \                 uncle 10 is RED → recolor
      //   10(B)  40(B)              10(B), 40(B), 30(B stays root)
      //            \
      //           50(R)
      const rbt = new RBT(30, 10, 40, 50);

      expect(rbt.root.value).toBe(30);
      expect(rbt.root.color).toBe("BLACK");
      expect(rbt.root.left.value).toBe(10);
      expect(rbt.root.left.color).toBe("BLACK");
      expect(rbt.root.right.value).toBe(40);
      expect(rbt.root.right.color).toBe("BLACK");
      expect(rbt.root.right.right.value).toBe(50);
      expect(rbt.root.right.right.color).toBe("RED");

      //       30(B)               45(R) under 50(R) left → RL violation
      //      /    \               uncle = null(B)
      //   10(B)  45(B)            → right rotate 50, left rotate 40
      //         / \                 recolor: 45(B), 40→RED
      //      40(R) 50(R)
      rbt.insert(45);

      expect(rbt.root.value).toBe(30);
      expect(rbt.root.color).toBe("BLACK");
      expect(rbt.root.left.value).toBe(10);
      expect(rbt.root.left.color).toBe("BLACK");
      expect(rbt.root.right.value).toBe(45);
      expect(rbt.root.right.color).toBe("BLACK");

      expect(rbt.root.right.left.value).toBe(40);
      expect(rbt.root.right.left.color).toBe("RED");
      expect(rbt.root.right.right.value).toBe(50);
      expect(rbt.root.right.right.color).toBe("RED");
    });

    describe("Complex sequences with cascading fixup", () => {
      test("should maintain RB invariants through multi-level recoloring and rotations", () => {
        //                 30(B)
        //                /    \
        //             10(B)   50(B)
        //            /   \   /    \
        //          5(B) 20(B) 40(B) 70(R)
        //                          /    \
        //                        60(B)  80(B)
        //                              /    \
        //                            75(R)  90(R)
        const rbt = new RBT(5, 10, 20, 30, 40, 50, 60, 70, 75, 80, 90);

        // Verify specific tree structure - root, colors, relationships
        expect(rbt.root.value).toBe(30);
        expect(rbt.root.color).toBe("BLACK");
        expect(rbt.root.left.value).toBe(10);
        expect(rbt.root.left.color).toBe("BLACK");
        expect(rbt.root.right.value).toBe(50);
        expect(rbt.root.right.color).toBe("BLACK");
        expect(rbt.root.left.left.value).toBe(5);
        expect(rbt.root.left.left.color).toBe("BLACK");
        expect(rbt.root.left.right.value).toBe(20);
        expect(rbt.root.left.right.color).toBe("BLACK");
        expect(rbt.root.right.left.value).toBe(40);
        expect(rbt.root.right.left.color).toBe("BLACK");
        expect(rbt.root.right.right.value).toBe(70);
        expect(rbt.root.right.right.color).toBe("RED");
        expect(rbt.root.right.right.left.value).toBe(60);
        expect(rbt.root.right.right.left.color).toBe("BLACK");
        expect(rbt.root.right.right.right.value).toBe(80);
        expect(rbt.root.right.right.right.color).toBe("BLACK");
        expect(rbt.root.right.right.right.left.value).toBe(75);
        expect(rbt.root.right.right.right.left.color).toBe("RED");
        expect(rbt.root.right.right.right.right.value).toBe(90);
        expect(rbt.root.right.right.right.right.color).toBe("RED");
      });
    });
  });

  describe("Search", () => {
    test("should find values that exist in the tree", () => {
      //         10(B)
      //        /    \
      //      5(B)   15(B)
      //     / \    / \
      //   3(R) 7(R) 12(R) 20(R)
      const rbt = new RBT(10, 5, 15, 3, 7, 12, 20);

      expect(rbt.search(10)).toBe(true);
      expect(rbt.search(5)).toBe(true);
      expect(rbt.search(15)).toBe(true);
      expect(rbt.search(3)).toBe(true);
      expect(rbt.search(20)).toBe(true);
    });

    test("should return node object when returnBoolean=false, boolean when true", () => {
      //       10(B)
      //      /    \
      //    5(R)  15(R)
      const rbt = new RBT(10, 5, 15);

      // Default (true) returns boolean
      expect(rbt.search(10)).toBe(true);
      expect(rbt.search(99)).toBe(false);

      // false returns actual node
      const node = rbt.search(10, rbt.root, false);
      expect(node.value).toBe(10);
      expect(node.color).toBe("BLACK");
      expect(typeof node).toBe("object");
    });

    test("should return false for non-existent values", () => {
      //       10(B)
      //      /    \
      //    5(R)  15(R)
      const rbt = new RBT(10, 5, 15);

      expect(rbt.search(100)).toBe(false);
      expect(rbt.search(-50)).toBe(false);
      expect(rbt.search(7)).toBe(false);

      expect(rbt.search(5, rbt.root.right)).toBe(false); // 5 not in right subtree (node 15)
      expect(rbt.search(15, rbt.root.right)).toBe(true); // Found in right subtree
    });

    test("should return false when searching empty tree", () => {
      const rbt = new RBT();
      expect(rbt.search(10)).toBe(false);
    });

    test("findMin() should return the minimum value", () => {
      //         10(B)
      //        /    \
      //      5(B)   15(B)
      //     / \    / \
      //   3(R) 7(R) 12(R) 20(R)
      const rbt = new RBT(10, 5, 15, 3, 7, 12, 20);
      expect(rbt.findMin()).toBe(3);
    });

    test("findMax() should return the maximum value", () => {
      //         10(B)
      //        /    \
      //      5(B)   15(B)
      //     / \    / \
      //   3(R) 7(R) 12(R) 20(R)
      const rbt = new RBT(10, 5, 15, 3, 7, 12, 20);
      expect(rbt.findMax()).toBe(20);
    });

    test("findMin() should return null for empty tree", () => {
      const rbt = new RBT();
      expect(rbt.findMin()).toBe(null);
    });

    test("findMax() should return null for empty tree", () => {
      const rbt = new RBT();
      expect(rbt.findMax()).toBe(null);
    });
  });

  describe("Deletion", () => {
    describe("Helper function - returns correct deleted nodes", () => {
      test("returns correct after deleting leaf node", () => {
        //     2(B)
        //    /    \
        //   1(R)  3(R)
        const tree = new RBT(1, 2, 3);

        const [_, deletedNode] = tree._deleteHelper(tree.root, 1);
        expect(deletedNode.value).toBe(1);

        const [_2, deletedNode2] = tree._deleteHelper(tree.root, 3);
        expect(deletedNode2.value).toBe(3);
      });

      test("returns correct node when deleting node with only left child", () => {
        //       2(B)
        //      /    \
        //    1(B)  3(B)
        //    /
        //  -1(R)
        const tree = new RBT(1, 2, 3, -1);

        const [_, deletedNode] = tree._deleteHelper(tree.root, 1);
        expect(deletedNode.value).toBe(1);
      });

      test("returns correct node when deleting node with one child", () => {
        //     2(B)
        //    /    \
        //   1(B)  3(B)
        //           \
        //          4(R)
        const tree = new RBT(1, 2, 3, 4); // 3 has right child 4
        const [_, deletedNode] = tree._deleteHelper(tree.root, 3);
        expect(deletedNode.value).toBe(3);
      });

      test("returns correct after deleting non-leaf node", () => {
        //     2(B)
        //    /    \
        //   1(R)  3(R)
        const tree = new RBT(1, 2, 3);

        const [_, deletedNode] = tree._deleteHelper(tree.root, 2);
        expect(deletedNode.value).toBe(3);
      });

      test("returns null when deleting empty tree", () => {
        const tree = new RBT();
        const [_, deletedNode] = tree._deleteHelper(tree.root, 99);
        expect(deletedNode).toBe(null);
      });
    });

    describe("Red Nodes", () => {
      let rbt;

      // Creating a base Red Black Tree before deletion
      //              50(B)
      //            /      \
      //         20(R)     70(R)
      //        /    \    /    \
      //     10(B) 30(B) 60(B) 80(B)
      //     /     / \            \
      //    5(R) 25(R) 40(R)    90(R)
      beforeEach(() => {
        // rbt = new RBT(5, 10, 20, 30, 40, 50, 60, 70, 75, 80, 90);
        rbt = new RBT(50, 20, 70, 10, 40, 60, 80, 5, 30, 90, 25);
      });

      test("should maintain valid RB tree after deleting red leaf", () => {
        // Delete 5(R) leaf → simple removal, no fixup needed
        rbt.delete(5); // 5 is RED

        // Verifying RB invariants still hold
        expect(rbt.search(5)).toBe(false);
        expect(rbt.root.color).toBe("BLACK");

        expect(rbt.isTreeValid()).toBe(true);
      });

      test("should maintain valid RB tree after deleting red node with two children", () => {
        // Delete 70(R): has two children (60, 80)
        // Successor = 80, replaces 70's value, then delete 80's position
        rbt.delete(70); // 70 is RED with two children

        // Verifying RB invariants still hold
        expect(rbt.search(70)).toBe(false);
        expect(rbt.root.color).toBe("BLACK");

        expect(rbt.isTreeValid()).toBe(true);
      });
    });

    describe("Black Nodes", () => {
      let rbt;

      // Creating a base Red Black Tree before deletion
      //                50(B)
      //              /      \
      //           20(R)     70(R)
      //          /    \    /    \
      //       10(B) 30(B) 60(B) 80(B)
      //       /     / \         / \
      //      5(R) 25(R) 40(R) 75(R) 90(R)
      beforeEach(() => {
        // rbt = new RBT(5, 10, 20, 30, 40, 50, 60, 70, 75, 80, 90);
        rbt = new RBT(50, 20, 70, 10, 40, 60, 80, 5, 30, 90, 25, 75);
      });

      test("should maintain valid RB tree after deleting black node having red parent and red child node", () => {
        // Delete 10(B): has red child 5(R) which absorbs the black
        rbt.delete(10); // child(5) and parent(20) of 10 are RED

        // Verifying RB invariants still hold
        expect(rbt.search(10)).toBe(false);
        expect(rbt.root.color).toBe("BLACK");

        expect(rbt.isTreeValid()).toBe(true);
      });

      test("should maintain valid RB tree after deleting black node (has a red sibling)", () => {
        // Step 1: Strip 80's children to make it a leaf
        //                50(B)
        //              /      \
        //           20(R)     70(R)
        //          /    \    /    \
        //       10(B) 30(B) 60(B) 80(B)  ← now leaf
        //       /     / \
        //      5(R) 25(R) 40(R)
        rbt.delete(75);
        rbt.delete(90);

        // Step 2: Delete 80(B) leaf → fixup needed
        rbt.delete(80);

        // Step 3: Now delete 70 → 70's sibling (20 subtree) is RED → Case 1
        rbt.delete(70); // 70 has Red sibling

        // Verifying RB invariants still hold
        expect(rbt.search(70)).toBe(false);
        expect(rbt.root.color).toBe("BLACK");

        expect(rbt.isTreeValid()).toBe(true);
      });

      test("should maintain valid RB tree after deleting black node (has a black sibling with a red children)", () => {
        // Delete 60(B): sibling is 80(B) which has red children 75(R), 90(R)
        // → Case 3 (black sibling, red nephew) → rotation
        rbt.delete(60); // 60 has black sibling with red children (80)

        // Verifying RB invariants still hold
        expect(rbt.search(60)).toBe(false);
        expect(rbt.root.color).toBe("BLACK");

        expect(rbt.isTreeValid()).toBe(true);
      });

      test("should maintain valid RB tree after deleting black node (has a black sibling with a black children)", () => {
        // Step 1: Strip 80's red children to make its niblings BLACK/NIL
        //                50(B)
        //              /      \
        //           20(R)     70(R)
        //          /    \    /    \
        //       10(B) 30(B) 60(B) 80(B)  ← NIL children
        //       /     / \
        //      5(R) 25(R) 40(R)
        rbt.delete(75);
        rbt.delete(90);

        // Delete 60(B): sibling 80(B) has NIL children → Case 2 (recolor)
        rbt.delete(60); // 80 has black/NIL children

        // Verifying RB invariants still hold
        expect(rbt.search(60)).toBe(false);
        expect(rbt.root.color).toBe("BLACK");

        expect(rbt.isTreeValid()).toBe(true);
      });
    });

    describe("Root Node", () => {
      test("should delete root when it is the only node", () => {
        //   10(B)  →  null
        const rbt = new RBT(10);
        rbt.delete(10);

        expect(rbt.root).toBe(null);
        expect(rbt.size()).toBe(0);
      });

      test("should delete root with two children and maintain valid RB tree", () => {
        //       10(B)
        //      /    \
        //    5(R)  15(R)
        // Delete root 10: successor=15, replace value, delete 15's position
        const rbt = new RBT(10, 5, 15);
        rbt.delete(10); // Root with two children

        expect(rbt.search(10)).toBe(false);
        expect(rbt.root.color).toBe("BLACK");
        expect(rbt.size()).toBe(2);
        expect(rbt.isTreeValid()).toBe(true);
      });

      test("should delete root with one child and maintain valid RB tree", () => {
        //     10(B)
        //    /
        //   5(R)
        // Delete root 10: child 5 replaces, recolor to BLACK
        const rbt = new RBT(10, 5);
        rbt.delete(10); // Root with one left child

        expect(rbt.search(10)).toBe(false);
        expect(rbt.root.color).toBe("BLACK");
        expect(rbt.root.value).toBe(5);
        expect(rbt.size()).toBe(1);
      });
    });

    describe("Edge Cases", () => {
      test("should return false when deleting non-existent value", () => {
        //       10(B)
        //      /    \
        //    5(R)  15(R)
        const rbt = new RBT(10, 5, 15);
        expect(rbt.delete(99)).toBe(false);
        expect(rbt.size()).toBe(3);
      });

      test("should return false when deleting from empty tree", () => {
        const rbt = new RBT();
        expect(rbt.delete(10)).toBe(false);
      });

      test("should handle deleting all nodes one by one", () => {
        //         10(B)
        //        /    \
        //      5(B)  15(B)
        //     / \
        //   3(R) 7(R)
        const rbt = new RBT(10, 5, 15, 3, 7);

        rbt.delete(3);
        expect(rbt.isTreeValid()).toBe(true);

        rbt.delete(7);
        expect(rbt.isTreeValid()).toBe(true);

        rbt.delete(5);
        expect(rbt.isTreeValid()).toBe(true);

        rbt.delete(15);
        expect(rbt.isTreeValid()).toBe(true);

        rbt.delete(10);
        expect(rbt.root).toBe(null);
        expect(rbt.size()).toBe(0);
      });

      test("should maintain valid RB tree after multiple sequential deletions", () => {
        //                50(B)
        //              /      \
        //           20(R)     70(R)
        //          /    \    /    \
        //       10(B) 30(B) 60(B) 80(B)
        //       /     / \         / \
        //      5(R) 25(R) 40(R) 75(R) 90(R)
        const rbt = new RBT(50, 20, 70, 10, 40, 60, 80, 5, 30, 90, 25, 75);

        rbt.delete(5);
        expect(rbt.isTreeValid()).toBe(true);

        rbt.delete(25);
        expect(rbt.isTreeValid()).toBe(true);

        rbt.delete(40);
        expect(rbt.isTreeValid()).toBe(true);

        rbt.delete(20);
        expect(rbt.isTreeValid()).toBe(true);

        rbt.delete(50);
        expect(rbt.isTreeValid()).toBe(true);

        rbt.delete(70);
        expect(rbt.isTreeValid()).toBe(true);

        expect(rbt.root.color).toBe("BLACK");
      });
    });

    describe("Cascading Fixup", () => {
      test("should handle double-black propagation up the tree", () => {
        //         50(B)
        //        /    \
        //     20(B)   70(B)
        //    / \     / \
        //  10(R) 40(R) 60(R) 80(R)
        const rbt = new RBT(50, 20, 70, 10, 40, 60, 80);

        // Delete leaves to create black-black sibling scenario
        rbt.delete(10);
        expect(rbt.isTreeValid()).toBe(true);

        rbt.delete(40);
        expect(rbt.isTreeValid()).toBe(true);

        // Deleting 20 should require cascading fixup
        rbt.delete(20);
        expect(rbt.isTreeValid()).toBe(true);
        expect(rbt.root.color).toBe("BLACK");
      });

      test("should handle Case 1 (red sibling) followed by Case 2/3/4", () => {
        //              50(B)
        //            /      \
        //         20(R)     70(R)
        //        /    \    /    \
        //     10(B) 30(B) 60(B) 80(B)
        //     /     / \            \
        //    5(R) 25(R) 40(R)    90(R)
        const rbt = new RBT(50, 20, 70, 10, 40, 60, 80, 5, 30, 90, 25);

        // Setup: delete nodes to create red sibling scenario
        rbt.delete(60);
        expect(rbt.isTreeValid()).toBe(true);

        rbt.delete(90);
        expect(rbt.isTreeValid()).toBe(true);

        // This should trigger Case 1 then continue fixup
        rbt.delete(80);
        expect(rbt.isTreeValid()).toBe(true);
        expect(rbt.root.color).toBe("BLACK");
      });
    });

    describe("Case 1: Black node with RED sibling", () => {
      test("should handle Case 1 when deleted node is LEFT child (right rotation on parent)", () => {
        //         20(B)
        //        /    \
        //     10(B)   30(B)
        //     /      / \
        //   5(R)  25(R) 40(R)
        const rbt = new RBT(20, 10, 30, 5, 25, 40);

        // Delete 5 to make 10 a leaf, then delete 10
        rbt.delete(5);
        rbt.delete(10); // BLACK left child, sibling 30 could be RED

        expect(rbt.isTreeValid()).toBe(true);
        expect(rbt.root.color).toBe("BLACK");
      });

      test("should handle Case 1 when deleted node is RIGHT child (left rotation on parent)", () => {
        //         30(B)
        //        /    \
        //     20(B)   40(B)
        //    / \     /
        //  10(R) 25(R) 35(R)
        const rbt = new RBT(30, 20, 40, 10, 25, 35);

        rbt.delete(35);
        rbt.delete(40); // BLACK right child, sibling 20 could be RED

        expect(rbt.isTreeValid()).toBe(true);
        expect(rbt.root.color).toBe("BLACK");
      });

      test("Case 1 should recurse into Case 2 after rotation", () => {
        // After Case 1 rotation, new sibling is BLACK with BLACK children → Case 2
        //           50(B)
        //          /    \
        //       20(B)   80(R)
        //      / \     / \
        //   10(R) 30(R) 60(B) 90(B)
        //              / \
        //            55(R) 70(R)
        const rbt = new RBT(50, 20, 80, 10, 30, 60, 90, 55, 70);

        rbt.delete(55);
        rbt.delete(70);

        // 60 is BLACK with BLACK/NIL children, sibling 90 is RED → Case 1 → Case 2
        rbt.delete(60);
        expect(rbt.isTreeValid()).toBe(true);
        expect(rbt.root.color).toBe("BLACK");
      });

      test("Case 1 should recurse into Case 3/4 after rotation", () => {
        // After Case 1 rotation, new sibling is BLACK with RED child → Case 3/4
        //             50(B)
        //            /    \
        //         20(B)   80(R)
        //        / \     / \
        //     10(R) 30(R) 60(B)  90(B)
        //                / \    / \
        //             55(R)70(R)85(R)95(R)
        const rbt = new RBT(50, 20, 80, 10, 30, 60, 90, 55, 70, 85, 95);

        rbt.delete(55);

        // 60 is BLACK, sibling 90 may be RED → Case 1 → then Case 3/4 with red nephew
        rbt.delete(60);
        expect(rbt.isTreeValid()).toBe(true);
        expect(rbt.root.color).toBe("BLACK");
      });
    });

    describe("Case 2: Black node with BLACK sibling and BLACK nephews", () => {
      test("should recolor sibling RED and stop when parent is RED", () => {
        // Parent is RED, sibling BLACK, nephews BLACK → recolor and done (1 level)
        //         50(B)
        //        /    \
        //     20(B)   70(B)
        //    / \     / \
        //  10(R) 40(R) 60(R) 80(R)
        const rbt = new RBT(50, 20, 70, 10, 40, 60, 80);

        // Delete both children of 20 to make them NIL
        rbt.delete(10);
        rbt.delete(40);

        // Now delete one child of 70 to create the scenario
        rbt.delete(60);
        expect(rbt.isTreeValid()).toBe(true);
      });

      test("should handle double-black reaching the root (2-level)", () => {
        // 3-node all-BLACK tree: Case 2 propagates to root
        //         4(B)
        //        /    \
        //      2(B)   6(B)
        //     / \    / \
        //   1(R) 3(R) 5(R) 7(R)
        const rbt = new RBT(4, 2, 6, 1, 3, 5, 7);

        // Strip RED leaves to get all-BLACK:
        //     4(B)
        //    /    \
        //   2(B)  6(B)
        rbt.delete(1);
        rbt.delete(3);
        rbt.delete(5);
        rbt.delete(7);
        expect(rbt.isTreeValid()).toBe(true);

        // Delete 2: Case 2, parent 4 is BLACK root → propagate to root → done
        rbt.delete(2);
        expect(rbt.isTreeValid()).toBe(true);
        expect(rbt.root.color).toBe("BLACK");
      });

      test("Case 2 at non-root BLACK parent must propagate upward (sorted insertions)", () => {
        // Sorted insertions create a tree where left subtree is all-BLACK
        // Tree structure after insertions:
        //              40(B)
        //            /     \
        //        20(B)      80(B)
        //       / \        / \
        //    10(B) 30(B) 60(R) 100(R)
        //                / \   / \
        //             50(B)70(B)90(B)110(B)
        //                              \
        //                            120(R)
        //
        // Deleting 10: parent 20(B) is non-root, sibling 30(B) has no children → Case 2
        // Without propagation: 20's subtree BH drops, 40 sees unequal BH → INVALID
        const rbt = new RBT(10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120);
        expect(rbt.isTreeValid()).toBe(true);

        // This single deletion REQUIRES Case 2 propagation past non-root parent
        rbt.delete(10);
        expect(rbt.isTreeValid()).toBe(true);
        expect(rbt.root.color).toBe("BLACK");
      });

      test("Case 2 propagation then Case 3 at grandparent level", () => {
        // After Case 2 recolors sibling and propagates up, the next level
        // has a sibling with RED children → resolves with Case 3 rotation
        const rbt = new RBT(10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120);
        expect(rbt.isTreeValid()).toBe(true);

        rbt.delete(10);
        expect(rbt.isTreeValid()).toBe(true);

        // Further deletions from the left side force more propagation
        rbt.delete(30);
        expect(rbt.isTreeValid()).toBe(true);

        rbt.delete(20);
        expect(rbt.isTreeValid()).toBe(true);
        expect(rbt.root.color).toBe("BLACK");
      });

      test("15-node tree: strip RED leaves then delete BLACK leaves requiring propagation", () => {
        //                    8(B)
        //                  /      \
        //               4(R)      12(R)
        //              / \       /    \
        //           2(B) 6(B)  10(B)  14(B)
        //          / \  / \   / \    / \
        //        1(R)3(R)5(R)7(R)9(R)11(R)13(R)15(R)
        const rbt = new RBT(8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15);
        expect(rbt.isTreeValid()).toBe(true);

        // Strip all RED leaves → interior nodes become BLACK leaves:
        //              8(B)
        //             /    \
        //           4(R)   12(R)
        //          / \    / \
        //        2(B) 6(B) 10(B) 14(B)
        [1, 3, 5, 7, 9, 11, 13, 15].forEach((v) => {
          rbt.delete(v);
          expect(rbt.isTreeValid()).toBe(true);
        });

        // Now delete BLACK leaves — each triggers Case 2 with BLACK parent
        // After first pair absorbed by RED parents, subsequent ones require propagation
        [2, 6, 10, 14].forEach((v) => {
          rbt.delete(v);
          expect(rbt.isTreeValid()).toBe(true);
        });

        // Continue: these deletions hit deeper fixup paths
        [4, 12].forEach((v) => {
          rbt.delete(v);
          expect(rbt.isTreeValid()).toBe(true);
        });

        rbt.delete(8);
        expect(rbt.root).toBe(null);
      });

      test("31-node tree: systematic layer-by-layer deletion forcing 3+ level propagation", () => {
        //                              16(B)
        //                           /          \
        //                        8(B)           24(B)
        //                      /     \         /     \
        //                   4(R)    12(R)    20(R)   28(R)
        //                  / \     / \     / \    / \
        //               2(B) 6(B) 10(B) 14(B) 18(B) 22(B) 26(B) 30(B)
        //              /\ /\  /\  /\  /\  /\  /\  /\
        //             1 3 5 7 9 11 13 15 17 19 21 23 25 27 29 31  (all RED)
        const rbt = new RBT(
          16,
          8,
          24,
          4,
          12,
          20,
          28,
          2,
          6,
          10,
          14,
          18,
          22,
          26,
          30,
          1,
          3,
          5,
          7,
          9,
          11,
          13,
          15,
          17,
          19,
          21,
          23,
          25,
          27,
          29,
          31,
        );
        expect(rbt.isTreeValid()).toBe(true);

        // Layer 4 (deepest RED leaves)
        [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31].forEach(
          (v) => {
            rbt.delete(v);
            expect(rbt.isTreeValid()).toBe(true);
          },
        );

        // Layer 3 (now BLACK leaves — propagation required at each level)
        [2, 6, 10, 14, 18, 22, 26, 30].forEach((v) => {
          rbt.delete(v);
          expect(rbt.isTreeValid()).toBe(true);
        });

        // Layer 2 (deeper propagation chains)
        [4, 12, 20, 28].forEach((v) => {
          rbt.delete(v);
          expect(rbt.isTreeValid()).toBe(true);
        });

        // Layer 1
        [8, 24].forEach((v) => {
          rbt.delete(v);
          if (rbt.root) {
            expect(rbt.isTreeValid()).toBe(true);
            expect(rbt.root.color).toBe("BLACK");
          }
        });

        // Root
        rbt.delete(16);
        expect(rbt.root).toBe(null);
      });

      test("Interleaved left-right deletions forcing repeated propagation", () => {
        //                    50(B)
        //                  /      \
        //               25(R)     75(R)
        //              / \       / \
        //           12(B) 37(B) 62(B) 87(B)
        //          / \  / \   / \   / \
        //        6(R)18(R)31(R)43(R)56(R)68(R)81(R)93(R)
        const rbt = new RBT(
          50,
          25,
          75,
          12,
          37,
          62,
          87,
          6,
          18,
          31,
          43,
          56,
          68,
          81,
          93,
        );
        expect(rbt.isTreeValid()).toBe(true);

        // Alternate deleting from deepest left and deepest right
        // This creates asymmetric black height deficits requiring propagation
        const deleteOrder = [
          6, 93, 18, 81, 12, 87, 31, 68, 43, 56, 37, 62, 25, 75, 50,
        ];
        for (const val of deleteOrder) {
          rbt.delete(val);
          if (rbt.root) {
            expect(rbt.isTreeValid()).toBe(true);
            expect(rbt.root.color).toBe("BLACK");
          }
        }
        expect(rbt.root).toBe(null);
      });

      test("Case 2 with non-root BLACK parent on the RIGHT side", () => {
        // Mirror case: reverse-sorted insertions, propagation on right side
        //                90(B)
        //              /     \
        //          50(B)      110(R)
        //         / \        / \
        //      30(R) 70(R) 100(B) 120(B)
        //     / \   / \
        //  20(B) 40(B) 60(B) 80(B)
        //  /
        // 10(R)
        const rbt = new RBT(120, 110, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10);
        expect(rbt.isTreeValid()).toBe(true);

        // Delete from right side to trigger Case 2 with BLACK parent
        rbt.delete(120);
        expect(rbt.isTreeValid()).toBe(true);

        rbt.delete(100);
        expect(rbt.isTreeValid()).toBe(true);

        rbt.delete(110);
        expect(rbt.isTreeValid()).toBe(true);
        expect(rbt.root.color).toBe("BLACK");
      });
    });

    describe("Case 3: Black node with BLACK sibling and RED far nephew (LL/RR)", () => {
      test("RR: sibling is right, far nephew (right) is RED", () => {
        //           50(B)
        //          /    \
        //       20(B)   70(R)
        //      / \     / \
        //   10(R) 40(R) 60(B) 80(B)
        //                       \
        //                      90(R)
        const rbt = new RBT(50, 20, 70, 10, 40, 60, 80, 90);

        rbt.delete(60); // Now 80(B) has right child 90(R)
        rbt.delete(10);
        rbt.delete(40);

        // 20 BLACK leaf, sibling is right, far nephew 90 is RED → RR
        rbt.delete(20);
        expect(rbt.isTreeValid()).toBe(true);
        expect(rbt.root.color).toBe("BLACK");
      });

      test("LL: sibling is left, far nephew (left) is RED", () => {
        //           50(B)
        //          /    \
        //       30(R)   70(B)
        //      / \     / \
        //   20(B) 40(B) 60(R) 80(R)
        //   /
        //  10(R)
        const rbt = new RBT(50, 30, 70, 20, 40, 60, 80, 10);

        rbt.delete(40); // Now 30(B) has left child 20 with child 10
        rbt.delete(60);
        rbt.delete(80);

        // 70 BLACK leaf, sibling is left, far nephew 10 is RED → LL
        rbt.delete(70);
        expect(rbt.isTreeValid()).toBe(true);
        expect(rbt.root.color).toBe("BLACK");
      });

      test("RR: sibling right with both nephews RED (should pick far)", () => {
        //            50(B)
        //           /    \
        //        20(B)   70(R)
        //       / \     / \
        //    10(R) 40(R) 60(B) 80(B)
        //               / \   / \
        //            55(R)65(R)75(R)90(R)
        const rbt = new RBT(50, 20, 70, 10, 40, 60, 80, 55, 65, 75, 90);

        rbt.delete(10);
        rbt.delete(40);

        // 20 BLACK, sibling subtree has RED nephews → should prefer far (RR)
        rbt.delete(20);
        expect(rbt.isTreeValid()).toBe(true);
        expect(rbt.root.color).toBe("BLACK");
      });

      test("LL: sibling left with both nephews RED (should pick far)", () => {
        //            50(B)
        //           /    \
        //        20(R)   70(B)
        //       / \     / \
        //    10(B) 30(B) 60(R) 80(R)
        //   / \  / \
        //  5(R)15(R)25(R)35(R)
        const rbt = new RBT(50, 20, 70, 10, 30, 60, 80, 5, 15, 25, 35);

        rbt.delete(60);
        rbt.delete(80);

        // 70 BLACK, sibling subtree has RED nephews → should prefer far (LL)
        rbt.delete(70);
        expect(rbt.isTreeValid()).toBe(true);
        expect(rbt.root.color).toBe("BLACK");
      });
    });

    describe("Case 3: Black node with BLACK sibling and RED near nephew (LR/RL)", () => {
      test("RL: sibling is right, only near nephew (left) is RED", () => {
        //           50(B)
        //          /    \
        //       20(B)   70(R)
        //      / \     / \
        //   10(R) 40(R) 60(B) 80(B)
        //                    /
        //                  75(R)
        const rbt = new RBT(50, 20, 70, 10, 40, 60, 80, 75);

        rbt.delete(60); // 80 now has left child 75
        rbt.delete(10);
        rbt.delete(40);

        // 20 BLACK leaf, sibling right, only near nephew 75 is RED → RL double rotation
        rbt.delete(20);
        expect(rbt.isTreeValid()).toBe(true);
        expect(rbt.root.color).toBe("BLACK");
      });

      test("LR: sibling is left, only near nephew (right) is RED", () => {
        //           50(B)
        //          /    \
        //       30(R)   70(B)
        //      / \     / \
        //   20(B) 40(B) 60(R) 80(R)
        //           /
        //         35(R)
        const rbt = new RBT(50, 30, 70, 20, 40, 60, 80, 35);

        rbt.delete(40); // 30 now has... let me build this carefully
        rbt.delete(60);
        rbt.delete(80);

        // 70 BLACK leaf, sibling left, only near nephew 35 is RED → LR double rotation
        rbt.delete(70);
        expect(rbt.isTreeValid()).toBe(true);
        expect(rbt.root.color).toBe("BLACK");
      });
    });

    describe("Sibling Calculation", () => {
      test("should correctly identify sibling when deleted node is left child", () => {
        //         50(B)
        //        /    \
        //     20(B)   70(B)
        //    / \     / \
        //  10(R) 40(R) 60(R) 80(R)
        const rbt = new RBT(50, 20, 70, 10, 40, 60, 80);

        rbt.delete(10);
        rbt.delete(20); // Left child deleted, sibling should be 40's subtree

        expect(rbt.isTreeValid()).toBe(true);
        expect(rbt.root.color).toBe("BLACK");
      });

      test("should correctly identify sibling when deleted node is right child", () => {
        //         50(B)
        //        /    \
        //     20(B)   70(B)
        //    / \     / \
        //  10(R) 40(R) 60(R) 80(R)
        const rbt = new RBT(50, 20, 70, 10, 40, 60, 80);

        rbt.delete(80);
        rbt.delete(70); // Right child deleted, sibling should be 60's subtree

        expect(rbt.isTreeValid()).toBe(true);
        expect(rbt.root.color).toBe("BLACK");
      });
    });

    describe("Two-Children Deletion", () => {
      test("should handle deleting node with two children where successor is RED leaf", () => {
        //              50(B)
        //            /      \
        //         20(R)     70(R)
        //        /    \    /    \
        //     10(B) 30(B) 60(B) 80(B)
        //     /     / \            \
        //    5(R) 25(R) 40(R)    90(R)
        const rbt = new RBT(50, 20, 70, 10, 40, 60, 80, 5, 30, 90, 25);

        // 20 has two children, successor (25) is RED leaf
        rbt.delete(20);
        expect(rbt.search(20)).toBe(false);
        expect(rbt.isTreeValid()).toBe(true);
      });

      test("should handle deleting node with two children where successor is BLACK with RED child", () => {
        //                50(B)
        //              /      \
        //           20(R)     70(R)
        //          /    \    /    \
        //       10(B) 30(B) 60(B) 80(B)
        //       /     / \         / \
        //      5(R) 25(R) 40(R) 75(R) 90(R)
        const rbt = new RBT(50, 20, 70, 10, 40, 60, 80, 5, 30, 90, 25, 75);

        // 70 has two children, successor (75) is RED under BLACK 80
        rbt.delete(70);
        expect(rbt.search(70)).toBe(false);
        expect(rbt.isTreeValid()).toBe(true);
      });

      test("should handle deleting node with two children where successor is BLACK leaf", () => {
        //         50(B)
        //        /    \
        //     20(B)   70(B)
        //    / \     / \
        //  10(R) 40(R) 60(R) 80(R)
        const rbt = new RBT(50, 20, 70, 10, 40, 60, 80);

        // 50 (root) has two children, successor is 60 (BLACK leaf after rotation)
        rbt.delete(50);
        expect(rbt.search(50)).toBe(false);
        expect(rbt.isTreeValid()).toBe(true);
        expect(rbt.root.color).toBe("BLACK");
      });

      test("should handle deleting root with two children in larger tree", () => {
        //                50(B)
        //              /      \
        //           20(R)     70(R)
        //          /    \    /    \
        //       10(B) 30(B) 60(B) 80(B)
        //       /     / \         / \
        //      5(R) 25(R) 40(R) 75(R) 90(R)
        const rbt = new RBT(50, 20, 70, 10, 40, 60, 80, 5, 30, 90, 25, 75);

        rbt.delete(50); // Root deletion with successor
        expect(rbt.search(50)).toBe(false);
        expect(rbt.isTreeValid()).toBe(true);
        expect(rbt.root.color).toBe("BLACK");
      });
    });

    describe("Stress: Sequential Deletions", () => {
      test("should maintain RB invariants deleting all nodes left to right", () => {
        //         20(B)
        //        /    \
        //     10(B)   30(B)
        //    / \     / \
        //  5(R) 15(R) 25(R) 35(R)
        const values = [20, 10, 30, 5, 15, 25, 35];
        const rbt = new RBT(...values);

        const sorted = [...values].sort((a, b) => a - b);
        for (const val of sorted) {
          rbt.delete(val);
          if (rbt.root) {
            expect(rbt.isTreeValid()).toBe(true);
            expect(rbt.root.color).toBe("BLACK");
          }
        }
        expect(rbt.root).toBe(null);
      });

      test("should maintain RB invariants deleting all nodes right to left", () => {
        //         20(B)
        //        /    \
        //     10(B)   30(B)
        //    / \     / \
        //  5(R) 15(R) 25(R) 35(R)
        const values = [20, 10, 30, 5, 15, 25, 35];
        const rbt = new RBT(...values);

        const sorted = [...values].sort((a, b) => b - a);
        for (const val of sorted) {
          rbt.delete(val);
          if (rbt.root) {
            expect(rbt.isTreeValid()).toBe(true);
            expect(rbt.root.color).toBe("BLACK");
          }
        }
        expect(rbt.root).toBe(null);
      });

      test("should maintain RB invariants deleting in insertion order", () => {
        //                50(B)
        //              /      \
        //           20(R)     70(R)
        //          /    \    /    \
        //       10(B) 30(B) 60(B) 80(B)
        //       /     / \         / \
        //      5(R) 25(R) 40(R) 75(R) 90(R)
        const values = [50, 20, 70, 10, 40, 60, 80, 5, 30, 90, 25, 75];
        const rbt = new RBT(...values);

        for (const val of values) {
          rbt.delete(val);
          if (rbt.root) {
            expect(rbt.isTreeValid()).toBe(true);
            expect(rbt.root.color).toBe("BLACK");
          }
        }
        expect(rbt.root).toBe(null);
      });

      test("should maintain RB invariants with alternating left-right deletions", () => {
        //                50(B)
        //              /      \
        //           20(R)     70(R)
        //          /    \    /    \
        //       10(B) 30(B) 60(B) 80(B)
        //       /     / \         / \
        //      5(R) 25(R) 40(R) 75(R) 90(R)
        const values = [50, 20, 70, 10, 40, 60, 80, 5, 30, 25, 90, 75];
        const rbt = new RBT(...values);

        // Delete alternating min and max
        const deleteOrder = [5, 90, 10, 80, 20, 75, 25, 70, 30, 60, 40, 50];
        for (const val of deleteOrder) {
          rbt.delete(val);
          if (rbt.root) {
            expect(rbt.isTreeValid()).toBe(true);
            expect(rbt.root.color).toBe("BLACK");
          }
        }
        expect(rbt.root).toBe(null);
      });

      test("should handle 15-node tree with random deletion order", () => {
        //                    50(B)
        //                  /      \
        //               25(R)     75(R)
        //              / \       / \
        //           12(B) 37(B) 62(B) 87(B)
        //          / \  / \   / \   / \
        //        6(R)18(R)31(R)43(R)56(R)68(R)81(R)93(R)
        const rbt = new RBT(
          50,
          25,
          75,
          12,
          37,
          62,
          87,
          6,
          18,
          31,
          43,
          56,
          68,
          81,
          93,
        );

        const deleteOrder = [
          37, 6, 75, 18, 50, 93, 12, 68, 31, 81, 56, 43, 62, 25, 87,
        ];
        for (const val of deleteOrder) {
          rbt.delete(val);
          if (rbt.root) {
            expect(rbt.isTreeValid()).toBe(true);
            expect(rbt.root.color).toBe("BLACK");
          }
        }
        expect(rbt.root).toBe(null);
      });
    });
  });
});
