class RBNode {
  constructor(value, left = null, right = null, parent = null, color = "RED") {
    this.value = value;
    this.left = left;
    this.right = right;
    this.parent = parent;
    this.color = color;
  }
}

class RBT {
  constructor(...items) {
    this.root = null;
    this.nodeCount = 0;

    items?.forEach((item) => this.insert(item));
  }

  insert(value) {
    const newNode = new RBNode(value);

    const insertHelper = (root, newNode, parent) => {
      if (root === null) {
        this.nodeCount++;
        newNode.parent = parent;
        return newNode;
      } else if (newNode.value < root.value) {
        root.left = insertHelper(root.left, newNode, root);
      } else if (root.value < newNode.value) {
        root.right = insertHelper(root.right, newNode, root);
      }

      return root;
    };

    this.root = insertHelper(this.root, newNode, null);

    // Fixing colors of ancestor nodes
    this._insertFixup(newNode);

    // Making root node BLACK
    this.root.color = "BLACK";
  }

  search(value, startingNode = this.root) {
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

    return searchHelper(startingNode, value);
  }

  delete(value) {
    if (this.search(value) === null) return false;

    const [newRoot, deletedNode] = deleteHelper(this.root, value);
    this.root = newRoot;
    this.nodeCount--;

    // Fixing colors of ancestor nodes
    this._deleteFixup(deletedNode);

    return true;
  }

  _deleteHelper(root, value) {
    if (root == null) {
      return [root, null];
    }

    let deletedNode;

    if (value < root.value) {
      const [newRoot, delNode] = this._deleteHelper(root.left, value);
      root.left = newRoot;
      deletedNode = delNode;
    } else if (root.value < value) {
      const [newRoot, delNode] = this._deleteHelper(root.right, value);
      root.right = newRoot;
      deletedNode = delNode;
    } else {
      // If the node is a leaf node
      if (root.left === null && root.right === null) {
        return [null, root];
      } else if (root.left !== null && root.right === null) {
        deletedNode = root;
        root.left.parent = root.parent;
        root = root.left;
      } else if (root.left === null && root.right !== null) {
        deletedNode = root;
        root.right.parent = root.parent;
        root = root.right;
      } else {
        const successorNode = this._getSuccessorNode(root.right);

        // Replacing current node's value with the successor node's value
        root.value = successorNode.value;

        // Deleting successor node
        const [newRoot, delNode] = this._deleteHelper(
          root.right,
          successorNode.value,
        );
        root.right = newRoot;
        deletedNode = delNode;
      }
    }

    return [root, deletedNode];
  }

  _insertFixup(node) {
    // Return early for root node as there are no parents of root node
    if (this.root === node) return;

    const parentNode = this._getParentNode(node);
    const uncleNode = this._getUncleNode(node);

    // Case 1: Parent and uncle are both red;
    if (
      node?.color === "RED" &&
      parentNode?.color === "RED" &&
      uncleNode?.color === "RED"
    ) {
      let localNode = node,
        parent = parentNode,
        uncle = uncleNode,
        grandParent = this._getGrandParentNode(localNode);

      // Switch color of parent, uncle and grandparent
      this._switchColor(parent);
      this._switchColor(uncle);

      if (this.root !== grandParent) {
        this._switchColor(grandParent);
      }

      this._insertFixup(grandParent);
    }
    // Case 2: Parent is red and uncle is black or empty
    else if (
      node?.color === "RED" &&
      parentNode?.color === "RED" &&
      (uncleNode === null || uncleNode?.color === "BLACK")
    ) {
      let localNode = node,
        parent = parentNode,
        uncle = uncleNode,
        grandParent = this._getGrandParentNode(localNode);

      // LL Rotation
      if (grandParent?.left === parent && parent?.left === localNode) {
        this._rightRotate(grandParent);
      }
      // RR Rotation
      else if (grandParent?.right === parent && parent?.right === localNode) {
        this._leftRotate(grandParent);
      }
      // LR Rotation
      else if (grandParent?.left === parent && parent?.right === localNode) {
        this._leftRotate(parent);
        this._rightRotate(grandParent);
      }
      // RL Rotation
      else if (grandParent?.right === parent && parent?.left === localNode) {
        this._rightRotate(parent);
        this._leftRotate(grandParent);
      }
    }
  }

  _getGrandParentNode(node) {
    // Node doesn't have a parent
    if (!node?.parent?.parent) return null;

    return node.parent.parent;
  }

  _getParentNode(node) {
    // Node doesn't have a parent
    if (!node?.parent) return null;

    return node.parent;
  }

  _getUncleNode(node) {
    const parent = this._getParentNode(node);
    const grandParent = this._getGrandParentNode(node);

    // Node doesn't have a parent or a grandparent
    if (!parent || !grandParent) return null;

    // Node's parent is a left child, so uncle is the right child
    if (grandParent.left === parent) return grandParent.right;

    // Node's parent is a right child, so uncle is the left child
    return grandParent.left;
  }

  _switchColor(node) {
    if (!node) return;

    if (node.color === "RED") {
      node.color = "BLACK";
    } else {
      node.color = "RED";
    }
  }

  _rightRotate(node) {
    if (!node) return;

    const parent = this._getParentNode(node);
    const isLeftChild = parent?.left === node;

    const leftChild = node?.left;
    node.left = leftChild?.right;

    // Assigning new parent to node's new left child (it it exists)
    if (node?.left) {
      node.left.parent = node;
    }

    leftChild.right = node;

    // Switching parents
    [leftChild.parent, node.parent] = [node.parent, leftChild];

    // Switching colors
    [leftChild.color, node.color] = [node.color, leftChild.color];

    // Assigning the node as a child to it's own parent
    if (parent) {
      if (isLeftChild) {
        parent.left = leftChild;
      } else {
        parent.right = leftChild;
      }
    }
    // Parent is null when the node passed is the root
    else {
      this.root = leftChild;
    }
  }

  _leftRotate(node) {
    if (!node) return;

    const parent = this._getParentNode(node);
    const isLeftChild = parent?.left === node;

    const rightChild = node?.right;
    node.right = rightChild?.left;

    // Assigning new parent to node's new right child (it it exists)
    if (node?.right) {
      node.right.parent = node;
    }

    rightChild.left = node;

    // Switching parents
    [rightChild.parent, node.parent] = [node.parent, rightChild];

    // Switching colors
    [rightChild.color, node.color] = [node.color, rightChild.color];

    // Assigning the node as a child to it's own parent
    if (parent) {
      if (isLeftChild) {
        parent.left = rightChild;
      } else {
        parent.right = rightChild;
      }
    }
    // Parent is null when the node passed is the root
    else {
      this.root = rightChild;
    }
  }
  _getSuccessorNode(node) {
    let temp = node;

    while (temp.left) {
      temp = temp.left;
    }

    return temp;
  }

  search(value, startingNode = this.root) {
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

    return searchHelper(startingNode, value);
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

  isEmpty() {
    return this.size() === 0;
  }

  size() {
    return this.nodeCount;
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

  visualize() {
    if (this.root === null) {
      console.log("Empty tree");
      return;
    }

    const lines = [];
    const height = this.height();

    // BFS to collect nodes level by level
    const queue = [{ node: this.root, level: 0, pos: Math.pow(2, height - 1) }];
    const nodesByLevel = new Map();

    while (queue.length > 0) {
      const { node, level, pos } = queue.shift();

      if (!nodesByLevel.has(level)) {
        nodesByLevel.set(level, []);
      }
      nodesByLevel.get(level).push({ node, pos });

      if (node.left) {
        queue.push({
          node: node.left,
          level: level + 1,
          pos: pos - Math.pow(2, height - level - 2),
        });
      }
      if (node.right) {
        queue.push({
          node: node.right,
          level: level + 1,
          pos: pos + Math.pow(2, height - level - 2),
        });
      }
    }

    // Build output
    const maxWidth = Math.pow(2, height) * 3;
    for (let level = 0; level < height; level++) {
      const nodes = nodesByLevel.get(level) || [];
      const line = new Array(maxWidth).fill(" ");

      for (const { node, pos } of nodes) {
        const colorChar = node.color === "RED" ? "R" : "B";
        const str = `${node.value}${colorChar}`;
        const start = Math.floor(pos - str.length / 2);
        for (let i = 0; i < str.length; i++) {
          if (start + i >= 0 && start + i < maxWidth) {
            line[start + i] = str[i];
          }
        }
      }

      lines.push(line.join(""));
    }

    console.log(lines.join("\n"));
  }

  printTree(node = this.root, prefix = "", isLeft = true) {
    if (node === null) {
      console.log(`${prefix}${isLeft ? "└── " : "┌── "}null(B)`);
      return;
    }

    const color = node.color === "RED" ? "R" : "B";
    const parentVal = node.parent ? node.parent.value : "null";
    const arrow = isLeft ? "└── " : "┌── ";

    console.log(
      `${prefix}${arrow}${node.value}(${color})[parent:${parentVal}]`,
    );

    const newPrefix = prefix + (isLeft ? "    " : "│   ");

    if (node.right) {
      this.printTree(node.right, newPrefix, false);
    }
    if (node.left) {
      this.printTree(node.left, newPrefix, true);
    }
  }
}

module.exports = RBT;
