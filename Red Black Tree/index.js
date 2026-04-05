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

  delete(value) {
    if (!this.search(value)) return false;

    const [newRoot, deletedNode, replacementNode] = this._deleteHelper(
      this.root,
      value,
    );
    this.root = newRoot;
    this.nodeCount--;

    // Fixing colors of ancestor nodes
    this._deleteFixup(deletedNode, replacementNode);

    return true;
  }

  _deleteHelper(root, value) {
    if (root == null) {
      return [root, null, null];
    }

    let deletedNode, replacementNode;

    if (value < root.value) {
      const [newRoot, delNode, replNode] = this._deleteHelper(root.left, value);
      root.left = newRoot;
      deletedNode = delNode;
      replacementNode = replNode;
    } else if (root.value < value) {
      const [newRoot, delNode, replNode] = this._deleteHelper(
        root.right,
        value,
      );
      root.right = newRoot;
      deletedNode = delNode;
      replacementNode = replNode;
    } else {
      const parent = this._getParentNode(root);
      // If the node is a leaf node
      if (root.left === null && root.right === null) {
        return [
          null,
          root,
          {
            parent: parent,
            isLeft: parent?.left === root,
            sibling: this._getSiblingNode(root),
          },
        ];
      } else if (root.left !== null && root.right === null) {
        const originalRootColor = root.color;
        deletedNode = root;
        // If replacment node is null, then the properties of current node's relations are needed
        replacementNode = root.left ?? {
          parent: parent,
          isLeft: parent.left === root,
          sibling: this._getSiblingNode(root),
        };
        root.left.parent = root.parent;
        root = root.left;
        root.color = originalRootColor;
      } else if (root.left === null && root.right !== null) {
        const originalRootColor = root.color;
        deletedNode = root;
        // If replacment node is null, then the properties of current node's relations are needed
        replacementNode = root.right ?? {
          parent: parent,
          isLeft: parent?.left === root,
          sibling: this._getSiblingNode(root),
        };
        root.right.parent = root.parent;
        root = root.right;
        root.color = originalRootColor;
      } else {
        const successorNode = this._getSuccessorNode(root.right);
        const originalColor = root.color;

        // Replacing current node's value with the successor node's value
        root.value = successorNode.value;

        // Deleting successor node
        const [newRoot, delNode, replNode] = this._deleteHelper(
          root.right,
          successorNode.value,
        );

        // The replacement node should have the original deleted node's color
        // if (originalColor === "RED") {
        //   // No fixup needed for RED deletion
        //   return [root, null, replNode]; // Pass null as deletedNode to skip fixup
        // }

        root.right = newRoot;
        deletedNode = delNode;
        replacementNode = replNode;
      }
    }

    return [root, deletedNode, replacementNode];
  }

  _deleteFixup(node, replacementNode) {
    if (node === null) return;

    // Return if deleted node was red
    if (node.color === "RED") return;

    // No fixup needed if root is null (tree became empty)
    if (this.root === null) return;

    // If replacement is a real tree node (not synthetic),
    // it was a RED child that absorbed the black. No fixup needed.
    if (replacementNode instanceof RBNode) return;

    const oldParent = replacementNode?.parent;
    const sibling = replacementNode.isLeft ? oldParent?.right : oldParent?.left;
    const leftNibling = sibling?.left;
    const rightNibling = sibling?.right;
    let redColoredNilbing = null;

    if (replacementNode.isLeft) {
      // Deleted was left child, sibling is right → prefer right (far) nephew
      if (rightNibling?.color === "RED") redColoredNilbing = rightNibling;
      else if (leftNibling?.color === "RED") redColoredNilbing = leftNibling;
    } else {
      // Deleted was right child, sibling is left → prefer left (far) nephew
      if (leftNibling?.color === "RED") redColoredNilbing = leftNibling;
      else if (rightNibling?.color === "RED") redColoredNilbing = rightNibling;
    }

    // Case 1: If deleted node is black, its sibling is red
    if (node?.color === "BLACK" && sibling?.color === "RED") {
      // L Rotation
      if (oldParent?.left === sibling) {
        this._rightRotate(oldParent);

        // Sibling is now parent
        const newParent = sibling;

        newParent.color = "BLACK";

        // Old parent, now right of deleted node's sibling becomes red
        if (newParent?.right) newParent.right.color = "RED";
      }
      // R Rotation
      else if (oldParent?.right === sibling) {
        this._leftRotate(oldParent);

        // Sibling is now parent
        const newParent = sibling;

        newParent.color = "BLACK";

        // Old parent, now left of deleted node's sibling becomes red
        if (newParent?.left) newParent.left.color = "RED";
      }

      replacementNode.parent = oldParent;
      replacementNode.sibling =
        this._getSiblingNode(oldParent) ??
        (replacementNode.isLeft ? oldParent.right : oldParent.left);
      this._deleteFixup(node, replacementNode);
    }

    // Case 2: If deleted node is black, its sibling is also black and its niblings are also black/NIL
    else if (
      node?.color === "BLACK" &&
      sibling?.color === "BLACK" &&
      !redColoredNilbing
    ) {
      // Converting sibling to red
      sibling.color = "RED";

      // If parent was RED, it absorbs the double-black (becomes BLACK)
      // If parent was BLACK, propagate double-black upward
      if (oldParent.color === "RED") {
        oldParent.color = "BLACK";
      } else {
        // Parent was BLACK, propagate double-black upward
        const grandParent = this._getParentNode(oldParent);
        const newReplacementNode = {
          parent: grandParent,
          isLeft: grandParent?.left === oldParent,
          sibling: this._getSiblingNode(oldParent),
        };
        this._deleteFixup(oldParent, newReplacementNode);
      }
    }
    // Case 3: If deleted node is black, its sibling is also black and any of its nibling is red
    else if (
      node?.color === "BLACK" &&
      sibling?.color === "BLACK" &&
      redColoredNilbing
    ) {
      // Perform rotation

      // LL Rotation
      if (oldParent?.left === sibling && sibling?.left === redColoredNilbing) {
        this._rightRotate(oldParent);

        // Sibling is now parent
        const newParent = sibling;

        newParent.color = oldParent.color;

        if (newParent?.left) newParent.left.color = "BLACK";

        if (newParent?.right) newParent.right.color = "BLACK";
      }
      // RR Rotation
      else if (
        oldParent?.right === sibling &&
        sibling?.right === redColoredNilbing
      ) {
        this._leftRotate(oldParent);

        // Sibling is now parent
        const newParent = sibling;

        newParent.color = oldParent.color;

        if (newParent?.left) newParent.left.color = "BLACK";

        if (newParent?.right) newParent.right.color = "BLACK";
      }
      // LR Rotation
      else if (
        oldParent?.left === sibling &&
        sibling?.right === redColoredNilbing
      ) {
        this._leftRotate(sibling);
        this._rightRotate(oldParent);

        // Nibling is the new parent
        const newParent = redColoredNilbing;

        newParent.color = oldParent.color;

        if (newParent?.left) newParent.left.color = "BLACK";

        if (newParent?.right) newParent.right.color = "BLACK";
      }
      // RL Rotation
      else if (
        oldParent?.right === sibling &&
        sibling?.left === redColoredNilbing
      ) {
        this._rightRotate(sibling);
        this._leftRotate(oldParent);

        // Nibling is the new parent
        const newParent = redColoredNilbing;

        newParent.color = oldParent.color;

        if (newParent?.left) newParent.left.color = "BLACK";

        if (newParent?.right) newParent.right.color = "BLACK";
      }
    }
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
        grandParent.color = "RED";
        // Parent remains parent
        parent.color = "BLACK";
      }
      // RR Rotation
      else if (grandParent?.right === parent && parent?.right === localNode) {
        this._leftRotate(grandParent);
        grandParent.color = "RED";
        // Parent remains parent
        parent.color = "BLACK";
      }
      // LR Rotation
      else if (grandParent?.left === parent && parent?.right === localNode) {
        this._leftRotate(parent);
        this._rightRotate(grandParent);
        grandParent.color = "RED";

        // Node just inserted becomes the new parent, hence the recolor
        localNode.color = "BLACK";
      }
      // RL Rotation
      else if (grandParent?.right === parent && parent?.left === localNode) {
        this._rightRotate(parent);
        this._leftRotate(grandParent);
        grandParent.color = "RED";

        // Node just inserted becomes the new parent, hence the recolor
        localNode.color = "BLACK";
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

  _getSiblingNode(node) {
    const parent = this._getParentNode(node);

    // Node doesn't have a parent
    if (!parent) return null;

    // Node is a left child, so sibling is the right child
    if (parent.left === node) return parent.right;

    // Node is a right child, so sibling is the left child
    return parent.left;
  }

  _getNiblingNode(node, left = true) {
    const sibling = this._getSiblingNode(node);

    // Node doesn't have a sibling
    if (!sibling) return null;

    // Return sibling's left child
    if (left) return sibling.left;

    // Return sibling's right child
    return sibling.right;
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
    // [leftChild.color, node.color] = [node.color, leftChild.color];

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
    // [rightChild.color, node.color] = [node.color, rightChild.color];

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

  search(value, startingNode = this.root, returnBoolean = true) {
    const searchHelper = (root, value) => {
      if (root === null) return null;

      if (root.value === value) {
        return root;
      } else if (value < root.value) {
        return searchHelper(root.left, value);
      } else {
        return searchHelper(root.right, value);
      }
    };

    const result = searchHelper(startingNode, value);
    return returnBoolean ? !!result : result;
  }

  //  search(value, startingNode = this.root) {
  //   const searchHelper = (root, value) => {
  //     if (root === null) return null;

  //     if (root.value === value) {
  //       return true;
  //     } else if (value < root.value) {
  //       return searchHelper(root.left, value);
  //     } else {
  //       return searchHelper(root.right, value);
  //     }
  //   };

  //   return searchHelper(startingNode, value);
  // }

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

  isTreeValid() {
    return (
      this._hasNoRedRedViolations(this.root) &&
      this._getBlackHeight(this.root) !== -1
    );
  }

  _hasNoRedRedViolations(root) {
    const check = (node) => {
      if (!node) return true;
      if (node.color === "RED") {
        if (node.left?.color === "RED" || node.right?.color === "RED")
          return false;
      }
      return check(node.left) && check(node.right);
    };
    return check(root);
  }

  _getBlackHeight(node) {
    if (!node) return 1; // NIL is black
    const left = this._getBlackHeight(node.left);
    const right = this._getBlackHeight(node.right);
    if (left !== right) return -1; // violation
    return left + (node.color === "BLACK" ? 1 : 0);
  }

  visualize() {
    if (this.root === null) {
      console.log("Empty tree");
      return;
    }

    const lines = [];
    const treeHeight = this.height();

    const queue = [
      { node: this.root, level: 0, pos: Math.pow(2, treeHeight - 1) },
    ];
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
          pos: pos - Math.pow(2, treeHeight - level - 2),
        });
      }
      if (node.right) {
        queue.push({
          node: node.right,
          level: level + 1,
          pos: pos + Math.pow(2, treeHeight - level - 2),
        });
      }
    }

    const maxWidth = Math.pow(2, treeHeight) * 3;
    for (let level = 0; level < treeHeight; level++) {
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
    if (node.right) this.printTree(node.right, newPrefix, false);
    if (node.left) this.printTree(node.left, newPrefix, true);
  }
}

module.exports = RBT;
