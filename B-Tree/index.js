class Node {
  constructor(order, parent = null) {
    this.order = order;
    this.keys = new Array(order - 1).fill(null);
    this.children = new Array(order).fill(null);
    this.keyCount = 0;
    this.parent = parent;
  }
  insert(key) {
    // Step 1: insert key into current node in sorted order
    let insertIdx = this.keyCount - 1;
    while (insertIdx >= 0 && this.keys[insertIdx] > key) {
      this.keys[insertIdx + 1] = this.keys[insertIdx];
      insertIdx--;
    }
    this.keys[insertIdx + 1] = key;
    this.keyCount++;

    // If node is still within capacity, no split or promotion is needed
    if (this.keyCount < this.order) {
      return null;
    }

    // Step 2: node overflow split and propagate median key upwards recursively
    const splitResult = this.splitAtMedian();

    // Case 1: current node is root. Create new root
    if (!this.parent) {
      const { medianKey, leftNode, rightNode } = splitResult;
      const rootNode = new Node(this.order);
      rootNode.keys[0] = medianKey;
      rootNode.keyCount = 1;
      rootNode.children[0] = leftNode;
      rootNode.children[1] = rightNode;

      leftNode.parent = rootNode;
      rightNode.parent = rootNode;

      return rootNode;
    }

    // Case 2: current node has a parent, delegate split handling to parent
    return this.parent.handleChildSplit(splitResult, this);
  }

  handleChildSplit(splitResult, oldChild) {
    const { medianKey, leftNode, rightNode } = splitResult;
    const childIndex = this.children.indexOf(oldChild);

    // Insert medianKey into this node's keys at the child index
    let keyIdx = this.keyCount - 1;
    while (keyIdx >= childIndex) {
      this.keys[keyIdx + 1] = this.keys[keyIdx];
      keyIdx--;
    }
    this.keys[childIndex] = medianKey;
    this.keyCount++;

    // Shift children to the right to make room for rightNode
    let childIdx = this.keyCount;
    while (childIdx > childIndex + 1) {
      this.children[childIdx] = this.children[childIdx - 1];
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

    // Node overflow: split this node and let its parent handle the promotion
    const parentSplitResult = this.splitAtMedian();
    const {
      medianKey: parentMedian,
      leftNode: parentLeft,
      rightNode: parentRight,
    } = parentSplitResult;

    if (!this.parent) {
      const rootNode = new Node(this.order);
      rootNode.keys[0] = parentMedian;
      rootNode.keyCount = 1;
      rootNode.children[0] = parentLeft;
      rootNode.children[1] = parentRight;

      parentLeft.parent = rootNode;
      parentRight.parent = rootNode;

      return rootNode;
    }

    return this.parent.handleChildSplit(parentSplitResult, this);
  }

  splitAtMedian() {
    const medianIdx = Math.floor((this.keyCount - 1) / 2);
    const medianKey = this.keys[medianIdx];

    const leftNode = new Node(this.order);
    const rightNode = new Node(this.order);

    // Copy keys left of median into leftNode
    let leftKeyPos = 0;
    for (let i = 0; i < medianIdx; i++) {
      leftNode.keys[leftKeyPos] = this.keys[i];
      leftNode.keyCount++;
      leftKeyPos++;
    }

    // Copy keys right of median into rightNode
    let rightKeyPos = 0;
    for (let i = medianIdx + 1; i < this.keyCount; i++) {
      rightNode.keys[rightKeyPos] = this.keys[i];
      rightNode.keyCount++;
      rightKeyPos++;
    }

    // For internal nodes, also split and re-parent children
    if (!this.isLeaf()) {
      // Children to the left of median key belong to leftNode
      let leftChildPos = 0;
      for (let i = 0; i <= medianIdx; i++) {
        leftNode.children[leftChildPos] = this.children[i];
        if (this.children[i]) {
          this.children[i].parent = leftNode;
        }
        leftChildPos++;
      }

      // Children to the right of median key belong to rightNode
      let rightChildPos = 0;
      for (let i = medianIdx + 1; i <= this.keyCount; i++) {
        rightNode.children[rightChildPos] = this.children[i];
        if (this.children[i]) {
          this.children[i].parent = rightNode;
        }
        rightChildPos++;
      }
    }

    return { medianKey, leftNode, rightNode };
  }

  isLeaf() {
    return this.children.every((item) => item === null);
  }
}

class BTree {
  constructor(order) {
    this.order = order;
    this.root = null;
  }

  insert(key) {
    // If root node is null
    if (!this.root) {
      this.root = new Node(this.order);
      this.root.keys[0] = key;
      this.root.keyCount++;

      return this.root;
    }

    // Early return if key already exists in B-Tree
    if (this.search(key, true)) {
      return false;
    }

    // Find out the node in which key needs to be inserted
    const targetNode = this.search(key, false);
    // targetNode.insert(key)

    const newRoot = targetNode.insert(key); // returns root OR null
    if (newRoot) {
      this.root = newRoot;
    }
    return this.root;
  }

  // Searches for a key in B-Tree. strictMatch searches for node containing key
  search(key, strictMatch = true) {
    if (!this.root) {
      return false;
    }

    return this.traverseToLeaf(this.root, key, strictMatch);
  }

  // Recursively traverses to the leaf where key belongs
  traverseToLeaf(root, key, strictMatch) {
    // If current node contains the key as one of its keys
    if (root.keys.includes(key)) {
      return root;
    }
    // If current node is a leaf node
    else if (root.isLeaf()) {
      if (strictMatch) return false;
      return root;
    }
    // Find and search the appropriate child which may contain the key
    else {
      for (let i = 0; i < root.keyCount; i++) {
        if (key < root.keys[i]) {
          return this.traverseToLeaf(root.children[i], key, strictMatch);
        }
      }

      // Searching the last child for keys
      return this.traverseToLeaf(
        root.children[root.keyCount],
        key,
        strictMatch
      );
    }
  }
}

module.exports = BTree;
