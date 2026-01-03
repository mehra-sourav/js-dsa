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

    // Step 2: node overflow split and propagate median key upwards
    let currentNode = this;
    let newRoot = null;

    while (currentNode && currentNode.keyCount === currentNode.order) {
      const { medianKey, leftNode, rightNode } = currentNode.splitAtMedian();
      const parent = currentNode.parent;

      // Case 1: current node is root create new root
      if (!parent) {
        const rootNode = new Node(this.order);
        rootNode.keys[0] = medianKey;
        rootNode.keyCount = 1;
        rootNode.children[0] = leftNode;
        rootNode.children[1] = rightNode;

        // Update parent pointers for split children
        leftNode.parent = rootNode;
        rightNode.parent = rootNode;

        newRoot = rootNode;
        break;
      }

      // Case 2: current node has a parent insert median into parent
      const childIndexInParent = parent.children.indexOf(currentNode);

      // Insert medianKey into parent's keys at position childIndexInParent
      let parentKeyIdx = parent.keyCount - 1;
      while (parentKeyIdx >= childIndexInParent) {
        parent.keys[parentKeyIdx + 1] = parent.keys[parentKeyIdx];
        parentKeyIdx--;
      }
      parent.keys[childIndexInParent] = medianKey;
      parent.keyCount++;

      // Shift parent's children to the right to make room for rightNode
      let parentChildIdx = parent.keyCount;
      while (parentChildIdx > childIndexInParent + 1) {
        parent.children[parentChildIdx] = parent.children[parentChildIdx - 1];
        parentChildIdx--;
      }

      // Replace old child (currentNode) with leftNode and insert rightNode next to it
      parent.children[childIndexInParent] = leftNode;
      parent.children[childIndexInParent + 1] = rightNode;
      leftNode.parent = parent;
      rightNode.parent = parent;

      // Continue bubbling up if parent now overflows
      currentNode = parent;
    }

    return newRoot;
  }

  splitAtMedian() {
    // split left keys and left children
    // split right keys and children
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

// insert
// 1. isnert at root
// 2. find correct poisiont of key insert there.
// 3. find correct node, insert there
// 3.1. IF node is overfilling, split it, push mid to parent

module.exports = BTree;
