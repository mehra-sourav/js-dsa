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


        test.todo("should balance node correctly after multi-level node balancing")


    })

    describe.only("Deletion", () => {
        test("delete() should remove a leaf node", () => {
            const tree = new AVLTree(10, 5, 15);
            const initialSize = tree.size();
            const initialHeight = tree.height();

            expect(tree.delete(5)).toBe(true);
            expect(tree.search(5)).toBe(null);
            expect(tree.search(10)).toBe(true);
            expect(tree.search(15)).toBe(true);

            expect(tree.size()).toBe(initialSize - 1);
            expect(tree.height()).toBe(initialHeight);

            expect(tree.inOrderTraversal()).toEqual([10, 15]);
        });

        test("delete() should remove a node with one left child", () => {
            //      10
            //     /
            //    5
            //   /
            //  3
            const tree = new AVLTree(10, 5, 3);
            expect(tree.delete(3)).toBe(true);
            expect(tree.search(3)).toBe(null);
            expect(tree.search(5)).toBe(true);
            expect(tree.search(10)).toBe(true);
            expect(tree.inOrderTraversal()).toEqual([5, 10]);
        });

        test("delete() should remove a node with one right child", () => {
            //   10
            //     \
            //      15
            //        \
            //         20
            const tree = new AVLTree(10, 15, 20);
            expect(tree.delete(15)).toBe(true);
            expect(tree.search(15)).toBe(null);
            expect(tree.search(20)).toBe(true);
            expect(tree.search(10)).toBe(true);
            expect(tree.inOrderTraversal()).toEqual([10, 20]);
        });

        test("delete() should remove a node with two children", () => {
            //      10
            //     /  \
            //    5    15
            //   / \   /
            //  3   7 12
            const tree = new AVLTree(10, 5, 15, 3, 7, 12);
            expect(tree.delete(5)).toBe(true);
            expect(tree.search(5)).toBe(null);
            // In-order should still be sorted
            expect(tree.inOrderTraversal()).toEqual([3, 7, 10, 12, 15]);
        });

        test("delete() should remove the root node", () => {
            const tree = new AVLTree(10, 5, 15);
            expect(tree.delete(10)).toBe(true);
            expect(tree.search(10)).toBe(null);
            expect(tree.search(5)).toBe(true);
            expect(tree.search(15)).toBe(true);
            expect(tree.inOrderTraversal()).toEqual([5, 15]);
        });

        test("delete() should handle deleting from empty tree", () => {
            const tree = new AVLTree();
            expect(tree.delete(10)).toBe(false);
        });

        test("delete() should return false when deleting non-existent value", () => {
            const tree = new AVLTree(10, 5, 15);
            expect(tree.delete(100)).toBe(false);
            expect(tree.delete(-50)).toBe(false);
        });

        test.only("delete() should maintain AVLTree property after deletion", () => {
            const isTreeBalanced = () => {
                if (!this.root) return true;

                const stack = [];
                const heights = new Map();
                let node = this.root;

                while (node || stack.length) {
                    // Go as far left as possible
                    while (node) {
                        stack.push(node);
                        node = node.left;
                    }

                    node = stack[stack.length - 1];

                    // If right child exists and hasn't been processed yet, go right
                    if (node.right && !heights.has(node.right)) {
                        node = node.right;
                        continue;
                    }

                    stack.pop();

                    const leftHeight = heights.get(node.left) ?? 0;
                    const rightHeight = heights.get(node.right) ?? 0;

                    if (Math.abs(leftHeight - rightHeight) > 1) return false;

                    heights.set(node, 1 + Math.max(leftHeight, rightHeight));
                    node = null;
                }

                return true;
            }

            const tree = new AVLTree(50, 30, 70, 20, 40, 60, 80);
            tree.delete(30);
            tree.delete(70);
            tree.delete(50);

            // Check in-order is still sorted
            const inOrder = tree.inOrderTraversal();
            expect(inOrder).toEqual([20, 40, 60, 80]);

            // Verify BST property: each element < next element
            for (let i = 0; i < inOrder.length - 1; i++) {
                expect(inOrder[i]).toBeLessThan(inOrder[i + 1]);
            }

            tree.delete(80);
            console.log('here')

            // Verify AVL Balancing property
            const treeBalanced = isTreeBalanced();
            expect(treeBalanced).toBe(true);
        });
    });
})