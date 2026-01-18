const BPlusTree = require('./index');

describe('BPlusTree tests', () => {
  describe('Initialization', () => {
    it('creates empty BPlusTree with null root', () => {
      const tree = new BPlusTree(3);
      expect(tree.root).toBeNull();
      expect(tree.order).toBe(3);
    });

    it('handles different valid orders', () => {
      const tree4 = new BPlusTree(4);
      expect(tree4.order).toBe(4);
      expect(tree4.root).toBeNull();
    });
  });

  describe('Search (Query & Insert Locator)', () => {
    let tree;

    beforeEach(() => {
      tree = new BPlusTree(3);
    });

    it('empty tree returns false regardless of strictMatch', () => {
      expect(tree.search(42)).toBe(false);
      expect(tree.search(42, false)).toBe(false);
    });

    it('after single insert: finds leaf containing key (strict)', () => {
      tree.insert(10);
      const foundLeaf = tree.search(10);
      expect(foundLeaf).toBeDefined();
      expect(foundLeaf.isLeaf()).toBe(true);
      expect(foundLeaf.keys[0]).toBe(10);
    });

    it('missing key on single-leaf tree: false (strict=true)', () => {
      tree.insert(10);
      expect(tree.search(5)).toBe(false);
    });

    it('missing key on single-leaf tree: returns leaf (strict=false)', () => {
      tree.insert(10);
      const leaf = tree.search(5, false);
      expect(leaf).toBeDefined();
      expect(leaf.isLeaf()).toBe(true);
      expect(leaf.keys.slice(0, leaf.keyCount)).toContain(10);
    });
  });

  describe('Insert - Empty Tree Cases', () => {
    let tree;

    beforeEach(() => {
      tree = new BPlusTree(3);
    });

    it('insert first key creates root leaf with single key', () => {
      tree.insert(42);
      const root = tree.root;
      expect(root).toBeDefined();
      expect(root.isLeaf()).toBe(true);
      expect(root.keyCount).toBe(1);
      expect(root.keys[0]).toBe(42);
    });

    it('insert returns the root node', () => {
      const returned = tree.insert(42);
      expect(returned).toBe(tree.root);
    });

    it('multiple inserts before first split fill root leaf correctly', () => {
      tree.insert(10);
      tree.insert(30);

      const root = tree.root;
      expect(root.isLeaf()).toBe(true);
      expect(root.keyCount).toBe(2);
      expect(root.keys.slice(0, root.keyCount)).toEqual([10, 30]);
    });

    it('keys maintain sorted order after multiple inserts', () => {
      tree.insert(30);
      tree.insert(10);

      const root = tree.root;
      expect(root.keys.slice(0, root.keyCount)).toEqual([10, 30]);
    });

    it('insert duplicate on single-leaf tree returns false (early exit)', () => {
      tree.insert(42);
      const result = tree.insert(42);
      expect(result).toBe(false);
      expect(tree.root.keyCount).toBe(1);
    });
  });

  describe('Insert - First Leaf Split (order 3)', () => {
    let tree;

    beforeEach(() => {
      tree = new BPlusTree(3); // max 2 keys/leaf before split
    });

    it('3rd insert splits full root leaf into two leaves under new internal root', () => {
      tree.insert(10);
      tree.insert(30);
      tree.insert(20); // triggers first split

      const root = tree.root;
      expect(root).toBeDefined();
      expect(root.isLeaf()).toBe(false);
      expect(root.keyCount).toBe(1);

      const leftLeaf = root.children[0];
      const rightLeaf = root.children[1];

      expect(leftLeaf).toBeDefined();
      expect(rightLeaf).toBeDefined();
      expect(leftLeaf.isLeaf()).toBe(true);
      expect(rightLeaf.isLeaf()).toBe(true);

      const allLeafKeys = collectLeafKeysFromLeftmost(root);
      expect(allLeafKeys.sort((a, b) => a - b)).toEqual([10, 20, 30]);
    });

    it('leaf split wires next pointers between resulting leaves', () => {
      tree.insert(10);
      tree.insert(30);
      tree.insert(20);

      const root = tree.root;
      const leftmostLeaf = findLeftmostLeaf(root);
      expect(leftmostLeaf.isLeaf()).toBe(true);
      expect(leftmostLeaf.next).toBeDefined();

      const keysViaNext = collectKeysViaNext(leftmostLeaf);
      expect(keysViaNext).toEqual([10, 20, 30]);
    });
  });

  describe('Insert - Multiple Splits and Search Invariants (order 4)', () => {
    let tree;

    beforeEach(() => {
      tree = new BPlusTree(4); // max 3 keys/node
    });

    it('all inserted keys live in leaves and are searchable', () => {
      const keys = [10, 20, 30, 40, 50, 60, 70, 80];
      keys.forEach((k) => tree.insert(k));

      keys.forEach((key) => {
        const leaf = tree.search(key);
        expect(leaf).toBeDefined();
        expect(leaf.isLeaf()).toBe(true);
        expect(leaf.keys.slice(0, leaf.keyCount)).toContain(key);
      });

      const internalNodes = collectInternalNodes(tree.root);
      internalNodes.forEach((node) => {
        expect(node.isLeaf()).toBe(false);
      });
    });

    it('search with strict=false returns correct leaf for missing keys', () => {
      const keys = [10, 20, 30, 40, 50, 60, 70, 80];
      keys.forEach((k) => tree.insert(k));

      const targetLeaf = tree.search(35, false);
      expect(targetLeaf).toBeDefined();
      expect(targetLeaf.isLeaf()).toBe(true);

      const leafKeys = targetLeaf.keys.slice(0, targetLeaf.keyCount);
      const min = Math.min(...leafKeys);
      const max = Math.max(...leafKeys);
      expect(min).toBeLessThanOrEqual(35);
      expect(max).toBeGreaterThanOrEqual(35);
    });

    it('leaf-level next chain covers all keys in sorted order', () => {
      const keys = [40, 10, 70, 20, 80, 30, 50, 60];
      keys.forEach((k) => tree.insert(k));

      const leftmostLeaf = findLeftmostLeaf(tree.root);
      const keysViaNext = collectKeysViaNext(leftmostLeaf);
      expect(keysViaNext).toEqual([...keys].sort((a, b) => a - b));
    });
  });
});

/**
 * Helpers (similar style to B-Tree tests, but B+ specific)
 */

function findLeftmostLeaf(root) {
  let node = root;
  while (node && !node.isLeaf()) {
    node = node.children[0];
  }
  return node;
}

function collectLeafKeysFromLeftmost(root) {
  const leftmost = findLeftmostLeaf(root);
  if (!leftmost) return [];
  return collectKeysViaNext(leftmost);
}

function collectKeysViaNext(startLeaf) {
  const result = [];
  let leaf = startLeaf;
  while (leaf) {
    for (let i = 0; i < leaf.keyCount; i++) {
      result.push(leaf.keys[i]);
    }
    leaf = leaf.next;
  }
  return result;
}

function collectInternalNodes(node) {
  if (!node || node.isLeaf()) return [];

  const result = [node];
  for (let i = 0; i <= node.keyCount; i++) {
    const child = node.children[i];
    if (child) {
      result.push(...collectInternalNodes(child));
    }
  }
  return result;
}
    