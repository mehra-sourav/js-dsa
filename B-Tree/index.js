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

  delete(key) {
    const index = this.findKeyIndex(key);
    const minKeys = Math.floor((this.order - 1) / 2);

    // Case 1: Key is present in this node
    if (index < this.keyCount && this.keys[index] === key) {
      // Step 1: Delete key from current node while maintaining sorted order
      if (this.isLeaf()) {
        this.removeKeyAtIndex(index);
        return;
      }

      // Internal node: replace with predecessor or successor, or merge children
      const leftChild = this.children[index];
      const rightChild = this.children[index + 1];

      if (leftChild && leftChild.keyCount > minKeys) {
        const predecessorNode = leftChild.getRightmostLeaf();
        const predecessorKey =
          predecessorNode.keys[predecessorNode.keyCount - 1];
        this.keys[index] = predecessorKey;
        leftChild.delete(predecessorKey);
      } else if (rightChild && rightChild.keyCount > minKeys) {
        const successorNode = rightChild.getLeftmostLeaf();
        const successorKey = successorNode.keys[0];
        this.keys[index] = successorKey;
        rightChild.delete(successorKey);
      } else {
        const mergedChild = this.mergeChildrenAt(index);
        mergedChild.delete(key);
      }

      return;
    }

    // Case 2: Key is not in this node
    if (this.isLeaf()) {
      return;
    }

    // Find out the child node in which key needs to be deleted
    let childIndex = this.findChildIndexForKey(key);
    let child = this.children[childIndex];
    if (!child) {
      return;
    }

    if (child.keyCount === minKeys) {
      const leftSibling = childIndex > 0 ? this.children[childIndex - 1] : null;
      const rightSibling =
        childIndex < this.keyCount ? this.children[childIndex + 1] : null;

      // Case 1: Borrow from left sibling if possible
      if (leftSibling && leftSibling.keyCount > minKeys) {
        this.borrowFromLeft(childIndex);
      }
      // Case 2: Borrow from right sibling if possible
      else if (rightSibling && rightSibling.keyCount > minKeys) {
        this.borrowFromRight(childIndex);
      }
      // Both siblings are underflow
      else {
        // Case 3: Merge with left sibling if possible
        if (leftSibling) {
          child = this.mergeChildrenAt(childIndex - 1);
          childIndex = childIndex - 1;
        }
        // Case 4: Merge with right sibling if possible
        else if (rightSibling) {
          child = this.mergeChildrenAt(childIndex);
        }
      }
    }

    child.delete(key);
  }

  findKeyIndex(key) {
    let index = 0;
    while (index < this.keyCount && this.keys[index] < key) {
      index++;
    }
    return index;
  }

  findChildIndexForKey(key) {
    let index = 0;
    while (index < this.keyCount && key >= this.keys[index]) {
      index++;
    }
    return index;
  }

  removeKeyAtIndex(index) {
    for (let i = index; i < this.keyCount - 1; i++) {
      this.keys[i] = this.keys[i + 1];
    }
    this.keys[this.keyCount - 1] = null;
    this.keyCount--;
  }

  getLeftmostLeaf() {
    let node = this;
    while (!node.isLeaf()) {
      node = node.children[0];
    }
    return node;
  }

  getRightmostLeaf() {
    let node = this;
    while (!node.isLeaf()) {
      node = node.children[node.keyCount - 1];
    }
    return node;
  }

  mergeChildrenAt(index) {
    const leftChild = this.children[index];
    const rightChild = this.children[index + 1];
    const mergeKey = this.keys[index];

    const leftOriginalKeyCount = leftChild.keyCount;

    // Append mergeKey to left child
    leftChild.keys[leftChild.keyCount] = mergeKey;
    leftChild.keyCount++;

    // Append right child's keys
    for (let i = 0; i < rightChild.keyCount; i++) {
      leftChild.keys[leftChild.keyCount] = rightChild.keys[i];
      leftChild.keyCount++;
    }

    // If node is internal, append right child's children
    if (!leftChild.isLeaf()) {
      let destIndex = leftOriginalKeyCount + 1;
      for (let i = 0; i <= rightChild.keyCount; i++) {
        const child = rightChild.children[i];
        leftChild.children[destIndex] = child;
        if (child) {
          child.parent = leftChild;
        }
        destIndex++;
      }
    }

    // Remove mergeKey from parent keys
    for (let i = index; i < this.keyCount - 1; i++) {
      this.keys[i] = this.keys[i + 1];
    }
    this.keys[this.keyCount - 1] = null;

    // Remove rightChild from parent's children
    for (let i = index + 1; i < this.keyCount; i++) {
      this.children[i] = this.children[i + 1];
    }
    this.children[this.keyCount] = null;

    this.keyCount--;

    return leftChild;
  }

  borrowFromLeft(childIndex) {
    const child = this.children[childIndex];
    const leftSibling = this.children[childIndex - 1];

    // Shift child's keys right to make space for new keys
    for (let i = child.keyCount; i > 0; i--) {
      child.keys[i] = child.keys[i - 1];
    }

    // Shift child's children right to make space for new children
    if (!child.isLeaf()) {
      for (let i = child.keyCount + 1; i > 0; i--) {
        child.children[i] = child.children[i - 1];
      }
    }

    // Bring parent's separating key down into child
    child.keys[0] = this.keys[childIndex - 1];

    // For internal nodes, move last child of left sibling
    if (!child.isLeaf()) {
      child.children[0] = leftSibling.children[leftSibling.keyCount];
      if (child.children[0]) {
        child.children[0].parent = child;
      }
      leftSibling.children[leftSibling.keyCount] = null;
    }

    child.keyCount++;

    // Move left sibling's last key up to parent
    this.keys[childIndex - 1] = leftSibling.keys[leftSibling.keyCount - 1];
    leftSibling.keys[leftSibling.keyCount - 1] = null;
    leftSibling.keyCount--;
  }

  borrowFromRight(childIndex) {
    const child = this.children[childIndex];
    const rightSibling = this.children[childIndex + 1];

    // Bring parent's separating key down into child at the end
    child.keys[child.keyCount] = this.keys[childIndex];

    // For internal nodes, move first child of right sibling
    if (!child.isLeaf()) {
      child.children[child.keyCount + 1] = rightSibling.children[0];
      if (child.children[child.keyCount + 1]) {
        child.children[child.keyCount + 1].parent = child;
      }
    }

    child.keyCount++;

    // Move right sibling's first key up to parent
    this.keys[childIndex] = rightSibling.keys[0];

    // Shift right sibling's keys left
    for (let i = 0; i < rightSibling.keyCount - 1; i++) {
      rightSibling.keys[i] = rightSibling.keys[i + 1];
    }
    rightSibling.keys[rightSibling.keyCount - 1] = null;

    // Shift right sibling's children left
    if (!rightSibling.isLeaf()) {
      for (let i = 0; i < rightSibling.keyCount; i++) {
        rightSibling.children[i] = rightSibling.children[i + 1];
      }
      rightSibling.children[rightSibling.keyCount] = null;
    }

    rightSibling.keyCount--;
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

  delete(key) {
    // If tree is empty
    if (!this.root) {
      return false;
    }

    const nodeWithKey = this.search(key, true);
    if (!nodeWithKey) {
      return false;
    }

    this.root.delete(key);

    if (this.root && this.root.keyCount === 0) {
      if (this.root.isLeaf()) {
        this.root = null;
      } else {
        const newRoot = this.root.children[0];
        if (newRoot) {
          newRoot.parent = null;
        }
        this.root = newRoot;
      }
    }

    return true;
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
