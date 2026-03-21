class Node {
  constructor(value, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

class BST {
  constructor(...items) {
    this.root = null;
    this.nodeCount = 0;

    items?.forEach((item) => this.insert(item));
  }

  insert(value) {
    const insertHelper = (root, val) => {
      if (root === null) {
        this.nodeCount++;
        return new Node(val);
      } else if (val < root.value) {
        root.left = insertHelper(root.left, val);
      } else if (root.value < val) {
        root.right = insertHelper(root.right, val);
      }

      return root;
    };

    this.root = insertHelper(this.root, value);
  }

  search(value) {
    const searchHelper = (root, value) => {
      if (root === null) return null;

      if (root.value === value) {
        return true;
      } else if (value < root.value) {
        return searchHelper(root.left, value);
      } else {
        return searchHelper(root.right, value);
      }
    };

    return searchHelper(this.root, value);
  }

  delete(value) {
    if (this.search(value) === null) return false;

    const deleteHelper = (root, value) => {
      if (root == null) {
        return root;
      }

      if (value < root.value) {
        root.left = deleteHelper(root.left, value);
      } else if (root.value < value) {
        root.right = deleteHelper(root.right, value);
      } else {
        // If the node is a leaf node
        if (root.left === null && root.right === null) {
          return null;
        } else if (root.left !== null && root.right === null) {
          root = root.left;
        } else if (root.left === null && root.right !== null) {
          root = root.right;
        } else {
          const successorNode = this.getSuccessorNode(root.right);

          // Replacing current node's value with the successor node's value
          root.value = successorNode.value;

          // Deleting successor node
          root.right = deleteHelper(root.right, successorNode.value);
        }
      }

      return root;
    };

    this.root = deleteHelper(this.root, value);
    return true;
  }

  getSuccessorNode(node) {
    let temp = node;

    while (temp.left) {
      temp = temp.left;
    }

    return temp;
  }

  findMin() {
    if (this.root === null) return null;

    let temp = this.root;

    while (temp?.left !== null) {
      temp = temp.left;
    }

    return temp.value;
  }

  findMax() {
    if (this.root === null) return null;

    let temp = this.root;

    while (temp?.right !== null) {
      temp = temp.right;
    }

    return temp.value;
  }

  isEmpty() {
    return this.root === null;
  }

  height(startingNode = this.root) {
    const heightHelper = (root) => {
      if (root === null) {
        return 0;
      }

      const leftHeight = heightHelper(root.left);
      const rightHeight = heightHelper(root.right);

      return 1 + Math.max(leftHeight, rightHeight);
    };

    return heightHelper(startingNode);
  }

  depth(value) {
    if (this.search(value) === null) return -1;

    // const depthHelper = (root) => {
    //   if (root === null) {
    //     return 0;
    //   }

    //   const leftHeight = heightHelper(root.left);
    //   const rightHeight = heightHelper(root.right);

    //   return 1 + Math.max(leftHeight, rightHeight);
    // };

    // return depthHelper(this.root);
  }

  size() {
    return this.nodeCount;
  }

  preOrderTraversal(root = this.root) {
    if (root === null) {
      return [];
    }

    return [
      root.value,
      ...this.preOrderTraversal(root.left),
      ...this.preOrderTraversal(root.right),
    ];
  }

  inOrderTraversal(root = this.root) {
    if (root === null) {
      return [];
    }

    return [
      ...this.inOrderTraversal(root.left),
      root.value,
      ...this.inOrderTraversal(root.right),
    ];
  }

  postOrderTraversal(root = this.root) {
    if (root === null) {
      return [];
    }

    return [
      ...this.postOrderTraversal(root.left),
      ...this.postOrderTraversal(root.right),
      root.value,
    ];
  }
}

module.exports = BST;
