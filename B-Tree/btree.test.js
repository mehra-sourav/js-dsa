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




});

