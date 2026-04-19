const AVLTree = require("./index");

describe("AVL Tree", () => {
    describe("Initialization & Basic State", () => {
        test("should initialize an empty tree when no items are provided", () => {
            const tree = new AVLTree();
            expect(tree.root).toBe(null);
        });

        test("should initialize with items when provided in constructor", () => {
            const tree = new AVLTree(10, 5, 15);
            expect(tree.search(10)).toBe(true);
            expect(tree.search(5)).toBe(true);
            expect(tree.search(15)).toBe(true);
        });

        test("isEmpty() should return true for empty tree", () => {
            const tree = new AVLTree();
            expect(tree.isEmpty()).toBe(true);
        });

        test("isEmpty() should return false for non-empty tree", () => {
            const tree = new AVLTree(10);
            expect(tree.isEmpty()).toBe(false);
        });

        test("size() should return 0 for empty tree", () => {
            const tree = new AVLTree();
            expect(tree.size()).toBe(0);
        });

        test("size() should return correct count of nodes", () => {
            const tree = new AVLTree(10, 5, 15);
            expect(tree.size()).toBe(3);
        });

        test("size() should update correctly after insertions", () => {
            const tree = new AVLTree();
            expect(tree.size()).toBe(0);
            expect(tree.height()).toBe(0);

            tree.insert(10);
            expect(tree.size()).toBe(1);
            expect(tree.height()).toBe(1);

            tree.insert(5);
            expect(tree.size()).toBe(2);
            expect(tree.height()).toBe(2);

            tree.insert(15);
            expect(tree.size()).toBe(3);
            expect(tree.height()).toBe(2);
        });

        test.skip("size() should decrease after deletions", () => {
            const tree = new AVLTree(10, 5, 15, 3, 7);
            expect(tree.size()).toBe(5);

            tree.delete(3); // Delete leaf
            expect(tree.size()).toBe(4);

            tree.delete(5); // Delete node with one child
            expect(tree.size()).toBe(3);

            tree.delete(10); // Delete root with two children
            expect(tree.size()).toBe(2);

            // Cross-check: height updates after deletions
            expect(tree.height()).toBe(2);
        });

        test.skip("isEmpty() should become true after deleting all nodes", () => {
            const tree = new AVLTree(10, 5, 15);
            expect(tree.isEmpty()).toBe(false);

            tree.delete(10);
            tree.delete(5);
            tree.delete(15);

            expect(tree.isEmpty()).toBe(true);
            expect(tree.size()).toBe(0);
            expect(tree.height()).toBe(0);
        });
    });

    describe("Insertion", () => {
        test("balance of node should be updated after each insertion", () => {
            const tree = new AVLTree(1)

            expect(tree.size()).toBe(1);
            expect(tree.getBalance()).toBe(0);

            tree.insert(2);
            expect(tree.getBalance()).toBe(-1);

            tree.insert(0);
            expect(tree.getBalance()).toBe(0);
        })

        test("should balance node correctly after node is imbalanced (LL Rotation)", () => {
            const tree = new AVLTree(1)

            expect(tree.size()).toBe(1);
            expect(tree.getBalance()).toBe(0);

            tree.insert(-2);
            expect(tree.getBalance()).toBe(1);

            tree?.insert(-3);
            expect(tree.getBalance()).toBe(0);
        })

        test("should balance node correctly after node is imbalanced (LR Rotation)", () => {
            const tree = new AVLTree(1)

            expect(tree.size()).toBe(1);
            expect(tree.getBalance()).toBe(0);

            tree.insert(-2);
            expect(tree.getBalance()).toBe(1);

            tree?.insert(-1);
            expect(tree.getBalance()).toBe(0);
        })

        test("should balance node correctly after node is imbalanced (RR Rotation)", () => {
            const tree = new AVLTree(1)

            expect(tree.size()).toBe(1);
            expect(tree.getBalance()).toBe(0);

            tree.insert(2);
            expect(tree.getBalance()).toBe(-1);

            tree?.insert(3);
            expect(tree.getBalance()).toBe(0);
        })

        test("should balance node correctly after node is imbalanced (R: Rotation)", () => {
            const tree = new AVLTree(1)

            expect(tree.size()).toBe(1);
            expect(tree.getBalance()).toBe(0);

            tree.insert(3);
            expect(tree.getBalance()).toBe(-1);

            tree?.insert(2);
            expect(tree.getBalance()).toBe(0);
        })

        
    })
})