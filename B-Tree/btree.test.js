const BTree = require("./index");

describe('BTree tests', () => {
    describe("Initialization", () => {
        it('should create empty BTree with null root', () => {
            const btree = new BTree(3); // order 3 (min keys 1, max 2 per node) [web:25]
            expect(btree.root).toBeNull();
            expect(btree.order).toBe(3);
        });

        it('should initialize with valid order greater than 2', () => {
            const btree4 = new BTree(4);
            expect(btree4.order).toBe(4);
            expect(btree4.root).toBeNull();
        });

        it('should handle minimum valid order (3)', () => {
            const btree = new BTree(3);
            expect(btree.order).toBe(3);
        });

        // it('should throw error for invalid order less than 3', () => {
        //     expect(() => new BTree(2)).toThrow('Order must be at least 3'); // Add this validation to constructor [web:34]
        // });

        // it('should throw error for non-integer or negative order', () => {
        //     expect(() => new BTree(2.5)).toThrow();
        //     expect(() => new BTree(-1)).toThrow();
        //     expect(() => new BTree(0)).toThrow();
        // });
    });

    describe('BTree Search (Query & Insert Locator)', () => {
        let btree;

        beforeEach(() => {
            btree = new BTree(3); // max 2 keys/node
        });

        it('empty tree returns false regardless of strictMatch', () => {
            expect(btree.search(42)).toBe(false);
            expect(btree.search(42, false)).toBe(false);
        });

        it('after single insert: finds root key (strict)', () => {
            btree.insert(10);
            const foundNode = btree.search(10);
            expect(foundNode).toBeDefined();
            expect(foundNode.keys[0]).toBe(10);
        });

        it('missing key on single-node tree: false (strict=true)', () => {
            btree.insert(10);
            expect(btree.search(5)).toBe(false);
        });

        it('missing key on single-node tree: returns leaf/root (strict=false)', () => {
            btree.insert(10);
            const leafNode = btree.search(5, false);
            expect(leafNode).toBeDefined();
            expect(leafNode.isLeaf()).toBe(true);
            expect(leafNode.keys[0]).toBe(10);
        });
    });

    describe('BTree Insert - Empty Tree Cases', () => {
        let btree;

        beforeEach(() => {
            btree = new BTree(3); // max 2 keys/node
        });

        it('insert first key creates root leaf with single key', () => {
            btree.insert(42);
            const root = btree.root;
            expect(root).toBeDefined();
            expect(root.isLeaf()).toBe(true);
            expect(root.keyCount).toBe(1);
            expect(root.keys[0]).toBe(42);
        });

        it('insert returns the root node', () => {
            const returned = btree.insert(42);
            expect(returned).toBe(btree.root);
        });

        it('multiple inserts before split fill root correctly', () => {
            btree.insert(10);
            btree.insert(20); // still fits (max 2 keys)

            const root = btree.root;
            expect(root.keyCount).toBe(2);
            expect(root.keys[0]).toBe(10);
            expect(root.keys[1]).toBe(20);
            expect(root.isLeaf()).toBe(true);
        });

        it('keys maintain sorted order after multiple inserts', () => {
            btree.insert(30);
            btree.insert(10);

            expect(btree.root.keys[0]).toBe(10);
            expect(btree.root.keys[1]).toBe(30);
        });

        it('insert duplicate on single-node returns false (early exit)', () => {
            btree.insert(42);
            const result = btree.insert(42);
            expect(result).toBe(false);
            expect(btree.root.keyCount).toBe(1); // no change
        });
    });

    describe('BTree Insert - Root Split (First Overflow)', () => {
        let btree;

        beforeEach(() => {
            btree = new BTree(3);
        });

        it('3rd insert splits full root leaf, creates new root + 2 leaves', () => {
            btree.insert(1);
            btree.insert(3);
            btree.insert(2); // Triggers split: median=2

            const root = btree.root;
            expect(root.keyCount).toBe(1);
            expect(root.keys[0]).toBe(2); // median promoted
            expect(root.isLeaf()).toBe(false); // now internal

            const leftChild = root.children[0];
            const rightChild = root.children[1];
            expect(leftChild).toBeDefined();
            expect(rightChild).toBeDefined();
            expect(leftChild.isLeaf()).toBe(true);
            expect(rightChild.isLeaf()).toBe(true);

            // left: [1], right: [3]
            expect(leftChild.keyCount).toBe(1);
            expect(leftChild.keys[0]).toBe(1);
            expect(rightChild.keyCount).toBe(1);
            expect(rightChild.keys[0]).toBe(3);
        });

        it('split children have correct parents', () => {
            btree.insert(1);
            btree.insert(3);
            btree.insert(2);

            const root = btree.root;
            expect(root.children[0].parent).toBe(root);
            expect(root.children[1].parent).toBe(root);
        });

        it('ascending order split maintains structure', () => {
            btree.insert(10);
            btree.insert(20);
            btree.insert(30);

            expect(btree.root.keys[0]).toBe(20);
            expect(btree.root.children[0].keys[0]).toBe(10);
            expect(btree.root.children[1].keys[0]).toBe(30);
        });

        it('descending order split works', () => {
            btree.insert(30);
            btree.insert(20);
            btree.insert(10); // Node.insert shifts right, median=20?

            expect(btree.root.keys[0]).toBe(20);
            expect(btree.root.children[0].keys[0]).toBe(10);
            expect(btree.root.children[1].keys[0]).toBe(30);
        });

        it('post-split search finds keys correctly', () => {
            btree.insert(1);
            btree.insert(3);
            btree.insert(2);
            expect(btree.search(1)).toBeDefined();
            expect(btree.search(3)).toBeDefined();
            expect(btree.search(2)).toBeDefined();
            expect(btree.search(0, false).isLeaf()).toBe(true);
        });
    });

    describe('BTree Insert - Non-Root Leaf Split → Parent Promotion (order 5)', () => {
        let btree;

        beforeEach(() => {
            btree = new BTree(5);

            [10, 20, 30, 40, 50, 60, 70, 80].forEach(k => btree.insert(k));
        });

        it('inserts into correct non-root leaf (45 → middle child)', () => {
            btree.insert(45); // targets middle leaf range

            const root = btree.root;
            expect(root.isLeaf()).toBe(false);

            // Verify 45 exists in correct range child
            const targetChild = root.children.find(
                child => child?.keys.some(k => k === 45)
            );
            expect(targetChild).toBeDefined();
            expect(targetChild.isLeaf()).toBe(true);
            expect(targetChild.keys).toContain(45);
        });

        it('middle leaf overflow splits → median promoted + children shift right', () => {
            // Target middle child: fill to 4 keys → overflow
            btree.insert(42);
            btree.insert(45);
            btree.insert(48);
            btree.insert(46);

            const root = btree.root;
            expect(root.keyCount).toBeGreaterThan(2); // promotion happened

            // Children array grew, all non-null children respect invariants
            const children = root.children.filter(Boolean);
            expect(children.length).toBeGreaterThan(3);

            // Every root key separates child ranges correctly
            for (let i = 0; i < root.keyCount; i++) {
                const leftMax = children[i].keys[children[i].keyCount - 1];
                const rightMin = children[i + 1].keys[0];
                expect(leftMax).toBeLessThanOrEqual(root.keys[i]);
                expect(root.keys[i]).toBeLessThanOrEqual(rightMin);
            }
        });

        it('leftmost leaf overflow → full right-shift of keys/children', () => {
            // Overflow leftmost child specifically
            btree.insert(5);
            btree.insert(7);
            btree.insert(8);
            btree.insert(6);

            const root = btree.root;
            const children = root.children.filter(Boolean);

            expect(root.keyCount).toBe(3);

            // First two children separated by root.keys[0]
            expect(children[0].keys[children[0].keyCount - 1]).toBeLessThanOrEqual(root.keys[0]);
            expect(root.keys[0]).toBeLessThanOrEqual(children[1].keys[0]);

            expect(children[0].keyCount).toBe(3); // new left child
            expect(children[0].keys.filter(Boolean)).toEqual([5, 6, 7]);
            expect(children[1].keyCount).toBe(2); // new right child
            expect(children[1].keys.filter(Boolean)).toEqual([10, 20]);
            expect(children[2].keys[0]).toBe(40); // unchanged rightmost
        });

        it('rightmost leaf overflow → full left-shift of keys/children', () => {
            // Overflow rightmost child
            btree.insert(75);
            btree.insert(72);
            btree.insert(73);
            btree.insert(74);

            const root = btree.root;
            const children = root.children.filter(Boolean);
            const lastRootKey = root.keys[root.keyCount - 1];

            expect(root.keyCount).toBe(3);

            // Last two children separated by final root key
            expect(children[children.length - 2].keys[children[children.length - 2].keyCount - 1])
                .toBeLessThanOrEqual(lastRootKey);
            expect(lastRootKey).toBeLessThanOrEqual(children[children.length - 1].keys[0]);

            expect(children[1].keys[0]).toBe(40); // unchanged rightmost
            expect(children[2].keyCount).toBe(2); // new left child
            expect(children[2].keys.filter(Boolean)).toEqual([70, 72]);
            expect(children[3].keyCount).toBe(3); // new right child
            expect(children[3].keys.filter(Boolean)).toEqual([74, 75, 80]);
        });

        it('promotion maintains search invariants across all children', () => {
            // Multiple splits across different children
            [-2, 12, 35, 62, 78].forEach(k => btree.insert(k));

            // All original + new keys searchable
            [10, 20, 30, 40, 50, 60, 70, -2, 12, 35, 62, 78].forEach(key => {
                const node = btree.search(key);
                expect(node).toBeDefined();
                expect(node.keys.slice(0, node.keyCount)).toContain(key);
            });

            // Non-existing key → correct leaf
            const targetNode = btree.search(15, false)
            expect(targetNode.isLeaf()).toBe(true);
            expect(targetNode.keys.filter(Boolean)).toEqual([-2, 10, 12, 20])
        });

        it('all new siblings have correct parent pointers', () => {
            btree.insert(22); btree.insert(25); btree.insert(28); btree.insert(26);

            const root = btree.root;
            const children = root.children;

            // All non-null children point to root
            for (let i = 0; i < children.length; i++) {
                if (children[i]) {
                    expect(children[i].parent).toBe(root);
                }
            }
        });
    });

    describe.only('BTree Insert - Double Split (2-Level → New Root, order=5)', () => {
        let btree;

        beforeEach(() => {
            btree = new BTree(5); // max 4 keys/node
        });

        it.only('leaf split → full root split → new root (double promotion)', () => {
            [1, 3, 5, 7, 9, 12, 14, 16, 18, 22, 24, 26, 28, 30].forEach(k => btree.insert(k));

            // Overflow middle leaf → promote → root full → NEW ROOT!
            btree.insert(15);
            btree.insert(17);
            btree.insert(17.5);
            btree.insert(20);

            const newRoot = btree.root;
            expect(newRoot.keyCount).toBe(1);           // single median
            expect(newRoot.isLeaf()).toBe(false);
            expect(newRoot.children.filter(Boolean).length).toBe(2);

            // Both children (old roots) are internal nodes now
            newRoot.children.forEach(child => {
                expect(child.isLeaf()).toBe(false);
                expect(child.keyCount).toBe(2);           // split result
            });
        });

        it('double split maintains search across 3 levels', () => {
            [1, 3, 5, 7, 9, 12, 14, 16, 18, 22, 24, 26, 28, 30, 15, 17, 19, 20].forEach(k => btree.insert(k));

            // All keys work
            Array.from({ length: 18 }, (_, i) => i * 2 + 1).forEach(key => {
                expect(btree.search(key)).toBeDefined();
            });

            // Deep routing
            expect(btree.search(10, false).isLeaf()).toBe(true);
            expect(btree.search(21, false).isLeaf()).toBe(true);
        });

        it('3-level hierarchy has correct parent chain', () => {
            [1, 3, 5, 7, 9, 12, 14, 16, 18, 22, 24, 26, 28, 30, 15, 17, 19, 20].forEach(k => btree.insert(k));

            const newRoot = btree.root;        // Level 0
            const level1 = newRoot.children[0]; // Level 1 (old root)
            const level2Leaf = level1.children[0]; // Level 2 (leaf)

            expect(level1.parent).toBe(newRoot);
            expect(level2Leaf.parent).toBe(level1);
            expect(level2Leaf.isLeaf()).toBe(true);
        });

        it('height grows 2→3 + all nodes balanced', () => {
            function height(node) {
                if (!node || node.isLeaf()) return 1;
                return 1 + Math.max(...node.children.map(c => height(c)).filter(h => h > 0));
            }

            [1, 3, 5, 7, 9, 12, 14, 16, 18].forEach(k => btree.insert(k)); // 2 levels
            expect(height(btree.root)).toBe(2);

            btree.insert(22); btree.insert(24); btree.insert(26); btree.insert(28); // fill
            btree.insert(15); btree.insert(17); btree.insert(19); btree.insert(20); // DOUBLE SPLIT
            expect(height(btree.root)).toBe(3);

            // All leaf depths equal (balanced)
            const leaves = findAllLeaves(btree.root);
            const leafDepths = leaves.map(l => getDepth(btree.root, l));
            expect(new Set(leafDepths).size).toBe(1);
        });
    });

    // Helpers
    function findAllLeaves(node) {
        if (node.isLeaf()) return [node];
        return node.children.flatMap(findAllLeaves);
    }

    function getDepth(root, target) {
        function recurse(node, depth) {
            if (node === target) return depth;
            return node.children.map((c, i) => recurse(c, depth + 1)).find(d => d !== undefined);
        }
        return recurse(root, 0);
    }






});

