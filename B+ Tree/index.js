class Node {
  constructor(order, parent = null, next = null) {
    this.order = order;
    this.keys = new Array(order - 1).fill(null);
    this.children = new Array(order).fill(null);
    this.keyCount = 0;
    this.parent = parent;
    this.next = next;
  }
  /**
   * Inserts a key into a leaf node and performs a split if necessary.
   * Returns a new root Node when the split propagates to the top, or null otherwise.
   */
  insert(key) {
    // We assume this is always called on a leaf node
    let insertIdx = this.keyCount - 1;
    while (insertIdx >= 0 && this.keys[insertIdx] > key) {
      this.keys[insertIdx + 1] = this.keys[insertIdx];
      insertIdx--;
    }
    this.keys[insertIdx + 1] = key;
    this.keyCount++;

    // Still within capacity (max keys = order - 1)
    if (this.keyCount < this.order) {
      return null;
    }

    // Leaf overflow → split leaf and propagate upwards
    const splitResult = this.splitLeaf();

    // If this node was root, create a new root
    if (!this.parent) {
      const { separatorKey, leftNode, rightNode } = splitResult;
      const rootNode = new Node(this.order);
      rootNode.keys[0] = separatorKey;
      rootNode.keyCount = 1;
      rootNode.children[0] = leftNode;
      rootNode.children[1] = rightNode;

      leftNode.parent = rootNode;
      rightNode.parent = rootNode;

      return rootNode;
    }

    // Delegate split handling to parent
    return this.parent.handleChildSplit(splitResult, this);
  }

  /**
   * Split a full leaf node into two leaves.
   * Reuses the current node as the left leaf and creates a new right leaf.
   * Returns { separatorKey, leftNode, rightNode } for parent promotion.
   */
  splitLeaf() {
    const splitIndex = Math.floor(this.keyCount / 2);

    const leftLeaf = this;
    const rightLeaf = new Node(this.order);

    // Move upper half of keys into right leaf
    let rightPos = 0;
    for (let i = splitIndex; i < this.keyCount; i++) {
      rightLeaf.keys[rightPos] = leftLeaf.keys[i];
      rightLeaf.keyCount++;
      rightPos++;
    }

    // Clear moved keys from left leaf and adjust keyCount
    for (let i = splitIndex; i < leftLeaf.keyCount; i++) {
      leftLeaf.keys[i] = null;
    }
    leftLeaf.keyCount = splitIndex;

    // Wire up next pointers in the leaf-level linked list
    rightLeaf.next = leftLeaf.next;
    leftLeaf.next = rightLeaf;

    const separatorKey = rightLeaf.keys[0];
    return { separatorKey, leftNode: leftLeaf, rightNode: rightLeaf };
  }

  /**
   * Split an internal node that has overflowed after absorbing a child split.
   * Returns { separatorKey, leftNode, rightNode } for its parent.
   */
  splitInternal() {
    const medianIdx = Math.floor((this.keyCount - 1) / 2);
    const separatorKey = this.keys[medianIdx];

    const leftNode = new Node(this.order);
    const rightNode = new Node(this.order);

    // Copy keys left of median into leftNode
    let leftPos = 0;
    for (let i = 0; i < medianIdx; i++) {
      leftNode.keys[leftPos] = this.keys[i];
      leftNode.keyCount++;
      leftPos++;
    }

    // Copy keys right of median into rightNode
    let rightPos = 0;
    for (let i = medianIdx + 1; i < this.keyCount; i++) {
      rightNode.keys[rightPos] = this.keys[i];
      rightNode.keyCount++;
      rightPos++;
    }

    // Children: 0..medianIdx belong to leftNode, medianIdx+1..keyCount belong to rightNode
    for (let i = 0; i <= medianIdx; i++) {
      const child = this.children[i];
      leftNode.children[i] = child;
      if (child) {
        child.parent = leftNode;
      }
    }

    let destIndex = 0;
    for (let i = medianIdx + 1; i <= this.keyCount; i++) {
      const child = this.children[i];
      rightNode.children[destIndex] = child;
      if (child) {
        child.parent = rightNode;
      }
      destIndex++;
    }

    return { separatorKey, leftNode, rightNode };
  }

  /**
   * Handle a split from one of this node's children.
   * Inserts separatorKey and the two new child nodes, then splits this node if needed.
   */
  handleChildSplit(splitResult, oldChild) {
    const { separatorKey, leftNode, rightNode } = splitResult;
    const childIndex = this.children.indexOf(oldChild);

    // Insert separatorKey into this.keys at childIndex
    let keyIdx = this.keyCount - 1;
    while (keyIdx >= childIndex) {
      this.keys[keyIdx + 1] = this.keys[keyIdx];
      keyIdx--;
    }
    this.keys[childIndex] = separatorKey;
    this.keyCount++;

    // Shift children to the right to make room for rightNode
    let childIdx = this.keyCount;
    while (childIdx > childIndex + 1) {
      this.children[childIdx + 1] = this.children[childIdx];
      childIdx--;
    }

    this.children[childIndex] = leftNode;
    this.children[childIndex + 1] = rightNode;
    leftNode.parent = this;
    rightNode.parent = this;

    // If this node is within capacity after absorbing the split, we're done
    if (this.keyCount < this.order) {
      return null;
    }

    // Internal node overflow: split this node and let its parent handle promotion
    const parentSplitResult = this.splitInternal();

    if (!this.parent) {
      const {
        separatorKey: parentSeparator,
        leftNode: parentLeft,
        rightNode: parentRight,
      } = parentSplitResult;

      const rootNode = new Node(this.order);
      rootNode.keys[0] = parentSeparator;
      rootNode.keyCount = 1;
      rootNode.children[0] = parentLeft;
      rootNode.children[1] = parentRight;

      parentLeft.parent = rootNode;
      parentRight.parent = rootNode;

      return rootNode;
    }

    return this.parent.handleChildSplit(parentSplitResult, this);
  }

  isLeaf() {
    return this.children.every((child) => child === null);
  }
}

class BPlusTree {
  constructor(order) {
    this.order = order;
    this.root = null;
  }

  insert(key) {
    // Empty tree: create root leaf
    if (!this.root) {
      this.root = new Node(this.order);
      this.root.keys[0] = key;
      this.root.keyCount = 1;
      return this.root;
    }

    // Duplicate check
    const existingLeaf = this.search(key, true);
    if (existingLeaf) {
      return false;
    }

    // Find target leaf for insertion
    const targetLeaf = this.search(key, false);

    const newRoot = targetLeaf.insert(key);
    if (newRoot) {
      this.root = newRoot;
    }

    return this.root;
  }

  search(key, strictMatch = true) {
    if (!this.root) {
      return false;
    }

    const leaf = this.traverseToLeaf(this.root, key);
    // Getting all non null keys
    const keys = leaf.keys.slice(0, leaf.keyCount);

    if (keys.includes(key)) {
      return leaf;
    }

    if (strictMatch) {
      return false;
    }

    return leaf;
  }

  traverseToLeaf(node, key) {
    if (node.isLeaf()) return node;

    // choose child index based on separator keys
    let child = null;
    for (let i = 0; i < node.keyCount; i++) {
      if (key < node.keys[i]) {
        child = node.children[i];
        break;
      }
    }
    if (!child) {
      child = node.children[node.keyCount];
    }
    return this.traverseToLeaf(child, key);
  }
}

module.exports = BPlusTree;
