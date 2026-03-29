const RBT = require("./index");

describe("Red Black Tree (RBT)", () => {
  describe("Initialization & Basic State", () => {
    test("should initialize an empty tree when no items are provided", () => {
      const rbt = new RBT();
      expect(rbt.root).toBe(null);
    });

    test("root node should be black after single node insertion", () => {
      const rbt = new RBT(10);
      expect(rbt.root.color).toBe("BLACK");
    });

    test("root node should be black after multiple node insertion", () => {
      const rbt = new RBT(10, 20, 30);
      expect(rbt.root.color).toBe("BLACK");
    });

    test("should initialize with items when provided in constructor", () => {
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
      const rbt = new RBT(10, 5, 15);
      expect(rbt.size()).toBe(3);
    });

    test("size() should update correctly after insertions", () => {
      const rbt = new RBT();
      expect(rbt.size()).toBe(0);
      expect(rbt.height()).toBe(0);

      rbt.insert(10);
      expect(rbt.size()).toBe(1);
      expect(rbt.height()).toBe(1);

      rbt.insert(5);
      expect(rbt.size()).toBe(2);
      expect(rbt.height()).toBe(2);

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
      rbt.insert(3);

      expect(rbt.root.color).toBe("BLACK");

      rbt.insert(1);

      expect(rbt.root.value).toBe(3);
      expect(rbt.root.color).toBe("BLACK");
      expect(rbt.root.left.value).toBe(1);
      expect(rbt.root.left.color).toBe("RED");

      rbt.insert(4);

      expect(rbt.root.value).toBe(3);
      expect(rbt.root.color).toBe("BLACK");
      expect(rbt.root.left.value).toBe(1);
      expect(rbt.root.left.color).toBe("RED");
      expect(rbt.root.right.value).toBe(4);
      expect(rbt.root.right.color).toBe("RED");

      rbt.insert(5);

      expect(rbt.root.value).toBe(3);
      expect(rbt.root.color).toBe("BLACK");
      expect(rbt.root.left.value).toBe(1);
      expect(rbt.root.left.color).toBe("BLACK");
      expect(rbt.root.right.value).toBe(4);
      expect(rbt.root.right.color).toBe("BLACK");
      expect(rbt.root.right.right.value).toBe(5);
      expect(rbt.root.right.right.color).toBe("RED");

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
      const rbt = new RBT(30, 10, 40, 5);

      expect(rbt.root.value).toBe(30);
      expect(rbt.root.color).toBe("BLACK");
      expect(rbt.root.left.value).toBe(10);
      expect(rbt.root.left.color).toBe("BLACK");
      expect(rbt.root.right.value).toBe(40);
      expect(rbt.root.right.color).toBe("BLACK");
      expect(rbt.root.left.left.value).toBe(5);
      expect(rbt.root.left.left.color).toBe("RED");

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
      const rbt = new RBT(30, 10, 40, 50);

      expect(rbt.root.value).toBe(30);
      expect(rbt.root.color).toBe("BLACK");
      expect(rbt.root.left.value).toBe(10);
      expect(rbt.root.left.color).toBe("BLACK");
      expect(rbt.root.right.value).toBe(40);
      expect(rbt.root.right.color).toBe("BLACK");
      expect(rbt.root.right.right.value).toBe(50);
      expect(rbt.root.right.right.color).toBe("RED");

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
      const rbt = new RBT(30, 10, 40, 5);

      expect(rbt.root.value).toBe(30);
      expect(rbt.root.color).toBe("BLACK");
      expect(rbt.root.left.value).toBe(10);
      expect(rbt.root.left.color).toBe("BLACK");
      expect(rbt.root.right.value).toBe(40);
      expect(rbt.root.right.color).toBe("BLACK");
      expect(rbt.root.left.left.value).toBe(5);
      expect(rbt.root.left.left.color).toBe("RED");

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
      const rbt = new RBT(30, 10, 40, 50);

      expect(rbt.root.value).toBe(30);
      expect(rbt.root.color).toBe("BLACK");
      expect(rbt.root.left.value).toBe(10);
      expect(rbt.root.left.color).toBe("BLACK");
      expect(rbt.root.right.value).toBe(40);
      expect(rbt.root.right.color).toBe("BLACK");
      expect(rbt.root.right.right.value).toBe(50);
      expect(rbt.root.right.right.color).toBe("RED");

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
  });
});
