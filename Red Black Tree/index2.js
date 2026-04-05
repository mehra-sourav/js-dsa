const RED = "RED";
const BLACK = "BLACK";

class RBNode {
  constructor(value, left = null, right = null, parent = null, color = RED) {
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

    for (const item of items) {
      this.insert(item);
    }
  }

  // ──────────────────────────────────────────────
  //  PUBLIC API
  // ──────────────────────────────────────────────

  insert(value) {
    const newNode = new RBNode(value);

    // Standard BST insertion
    this.root = this._bstInsert(this.root, newNode, null);

    // Restore Red-Black properties that the new RED node may have violated
    this._insertFixup(newNode);

    // Rule 2: root is always BLACK
    this.root.color = BLACK;
  }

  delete(value) {
    const target = this._findNode(value, this.root);
    if (target === null) return false;

    this._deleteNode(target);
    this.nodeCount--;
    return true;
  }

  search(value, startingNode = this.root, returnBoolean = true) {
    const node = this._findNode(value, startingNode);

    if (returnBoolean) return node !== null;
    return node;
  }

  height(startingNode = this.root) {
    if (startingNode === null) return 0;

    const leftHeight = this.height(startingNode.left);
    const rightHeight = this.height(startingNode.right);

    return 1 + Math.max(leftHeight, rightHeight);
  }

  size() {
    return this.nodeCount;
  }

  isEmpty() {
    return this.nodeCount === 0;
  }

  findMin() {
    if (this.root === null) return null;
    return this._subtreeMin(this.root).value;
  }

  findMax() {
    if (this.root === null) return null;
    return this._subtreeMax(this.root).value;
  }

  isTreeValid() {
    return (
      this._hasNoRedRedViolations(this.root) &&
      this._computeBlackHeight(this.root) !== -1
    );
  }

  // ──────────────────────────────────────────────
  //  BST INSERT (standard, recursive)
  // ──────────────────────────────────────────────

  _bstInsert(current, newNode, parent) {
    if (current === null) {
      newNode.parent = parent;
      this.nodeCount++;
      return newNode;
    }

    if (newNode.value < current.value) {
      current.left = this._bstInsert(current.left, newNode, current);
    } else if (newNode.value > current.value) {
      current.right = this._bstInsert(current.right, newNode, current);
    }
    // Duplicate values are ignored (no insertion)

    return current;
  }

  // ──────────────────────────────────────────────
  //  INSERT FIXUP
  //  Walk up the tree fixing red-red violations.
  //  We only need to fix when both the node and
  //  its parent are RED (Rule 4 violation).
  // ──────────────────────────────────────────────

  _insertFixup(node) {
    while (node !== this.root && node.parent?.color === RED) {
      const parent = node.parent;
      const grandparent = parent.parent;

      // Parent is LEFT child of grandparent
      if (parent === grandparent?.left) {
        const uncle = grandparent.right;

        if (uncle?.color === RED) {
          // Case 1: Uncle is RED → recolor and move up
          parent.color = BLACK;
          uncle.color = BLACK;
          grandparent.color = RED;
          node = grandparent; // move fixup focus to grandparent
        } else {
          // Uncle is BLACK or NIL → rotation needed
          if (node === parent.right) {
            // Case 2c (LR): node is right child → left-rotate parent to get LL shape
            this._leftRotate(parent);
            // After rotation, the old parent is now below node.
            // Swap references so "node" points to the top of the pair.
            node = parent;
          }
          // Case 2a (LL): node is left child → right-rotate grandparent
          node.parent.color = BLACK;
          grandparent.color = RED;
          this._rightRotate(grandparent);
        }
      }
      // Mirror: Parent is RIGHT child of grandparent
      else {
        const uncle = grandparent?.left;

        if (uncle?.color === RED) {
          // Case 1: Uncle is RED → recolor and move up
          parent.color = BLACK;
          uncle.color = BLACK;
          grandparent.color = RED;
          node = grandparent;
        } else {
          if (node === parent.left) {
            // Case 2d (RL): node is left child → right-rotate parent to get RR shape
            this._rightRotate(parent);
            node = parent;
          }
          // Case 2b (RR): node is right child → left-rotate grandparent
          node.parent.color = BLACK;
          grandparent.color = RED;
          this._leftRotate(grandparent);
        }
      }
    }
  }

  // ──────────────────────────────────────────────
  //  DELETE NODE
  //  Handles BST removal + triggers fixup when a
  //  BLACK node is removed without a RED replacement.
  // ──────────────────────────────────────────────

  _deleteNode(target) {
    // If target has two children, swap with in-order successor
    // and delete the successor instead (it has at most one child).
    if (target.left !== null && target.right !== null) {
      const successor = this._subtreeMin(target.right);
      target.value = successor.value;
      target = successor; // now delete this node instead
    }

    // At this point, target has 0 or 1 child.
    const child = target.left ?? target.right; // the single child, or null
    const parent = target.parent;
    const wasLeft = parent?.left === target;
    const deletedColor = target.color;

    // Splice the target out of the tree, replacing it with child
    this._transplant(target, child);

    // Determine if fixup is needed:
    // - If deleted node was RED: no black-height change → no fixup
    // - If deleted node was BLACK and child is RED: child absorbs black → recolor and done
    // - If deleted node was BLACK and child is BLACK/NIL: double-black → fixup
    if (deletedColor === RED) {
      // Removing a RED node never affects black-height. Done.
      return;
    }

    if (child !== null) {
      // The replacement child exists and was RED (must be, since deleted was BLACK
      // and having two BLACK nodes in parent-child with no other child would violate
      // black-height). Recolor it BLACK to preserve the path's black count.
      child.color = BLACK;
      return;
    }

    // Deleted was BLACK, replacement is NIL → double-black situation.
    // We need to fix up, but we don't have a real node to point to.
    // Pass the parent and which side the double-black is on.
    if (parent === null) {
      // Deleted the root and tree is now empty. Nothing to fix.
      return;
    }

    this._deleteFixup(parent, wasLeft);
  }

  // ──────────────────────────────────────────────
  //  DELETE FIXUP
  //
  //  Resolves the "double-black" at position
  //  parent.left (if dbIsLeft=true) or parent.right.
  //
  //  The double-black means: that side is one BLACK
  //  short compared to the other side. We fix it by
  //  examining the sibling and its children.
  // ──────────────────────────────────────────────

  _deleteFixup(parent, dbIsLeft) {
    // The double-black (DB) position and its sibling
    const sibling = dbIsLeft ? parent.right : parent.left;

    // This should not happen in a valid tree, but guard anyway
    if (sibling === null) return;

    // ── Case 1: Sibling is RED ──
    // Rotate sibling up, swap colors with parent.
    // This converts to Case 2/3/4 (sibling will now be BLACK).
    if (sibling.color === RED) {
      sibling.color = BLACK;
      parent.color = RED;

      if (dbIsLeft) {
        this._leftRotate(parent);
      } else {
        this._rightRotate(parent);
      }

      // After rotation, DB's parent is still `parent` (which moved down),
      // and DB is still on the same side. Recurse with same parent & side
      // — the new sibling is now BLACK.
      this._deleteFixup(parent, dbIsLeft);
      return;
    }

    // From here, sibling is BLACK.
    const farNephew = dbIsLeft ? sibling.right : sibling.left;
    const nearNephew = dbIsLeft ? sibling.left : sibling.right;

    // ── Case 3: Far nephew is RED → single rotation (terminal) ──
    // This is checked before Case 4 because if far nephew is RED,
    // we can fix everything in one rotation regardless of near nephew.
    if (farNephew?.color === RED) {
      // Rotate parent toward DB. Sibling takes parent's place.
      sibling.color = parent.color; // sibling inherits parent's color
      parent.color = BLACK;
      farNephew.color = BLACK;

      if (dbIsLeft) {
        this._leftRotate(parent);
      } else {
        this._rightRotate(parent);
      }

      // Done — black-height is restored.
      return;
    }

    // ── Case 4: Near nephew is RED, far nephew is BLACK ──
    // Double rotation: first rotate sibling away from DB
    // to move the RED nephew to the far side, then fall into Case 3.
    if (nearNephew?.color === RED) {
      nearNephew.color = BLACK;
      sibling.color = RED;

      if (dbIsLeft) {
        // Near nephew is sibling's left child → right-rotate sibling
        this._rightRotate(sibling);
      } else {
        // Near nephew is sibling's right child → left-rotate sibling
        this._leftRotate(sibling);
      }

      // Now the near nephew is the new sibling, and the old sibling
      // is the far nephew (RED). This is exactly Case 3 — recurse.
      this._deleteFixup(parent, dbIsLeft);
      return;
    }

    // ── Case 2: Both nephews are BLACK (or NIL) ──
    // Recolor sibling RED to balance both sides (both lose one BLACK).
    // Then check if parent can absorb the deficit.
    sibling.color = RED;

    if (parent.color === RED) {
      // Parent absorbs the double-black by turning BLACK. Done.
      parent.color = BLACK;
    } else {
      // Parent is BLACK → it becomes the new double-black.
      // Propagate upward unless parent is root.
      if (parent.parent !== null) {
        const parentIsLeft = parent.parent.left === parent;
        this._deleteFixup(parent.parent, parentIsLeft);
      }
      // If parent IS root, every path lost one black equally → balanced. Done.
    }
  }

  // ──────────────────────────────────────────────
  //  TRANSPLANT
  //  Replaces subtree rooted at `target` with
  //  subtree rooted at `replacement` in the parent.
  // ──────────────────────────────────────────────

  _transplant(target, replacement) {
    if (target.parent === null) {
      // target was root
      this.root = replacement;
    } else if (target === target.parent.left) {
      target.parent.left = replacement;
    } else {
      target.parent.right = replacement;
    }

    if (replacement !== null) {
      replacement.parent = target.parent;
    }
  }

  // ──────────────────────────────────────────────
  //  ROTATIONS
  //  These preserve BST ordering and update parent
  //  pointers. They do NOT change colors — callers
  //  handle recoloring explicitly.
  // ──────────────────────────────────────────────

  _leftRotate(node) {
    //      node             rightChild
    //      / \                /  \
    //     a  rightChild    node   c
    //         / \          / \
    //        b   c        a   b

    const rightChild = node.right;
    if (rightChild === null) return;

    // Move rightChild's left subtree to node's right
    node.right = rightChild.left;
    if (rightChild.left !== null) {
      rightChild.left.parent = node;
    }

    // rightChild takes node's place in the tree
    rightChild.parent = node.parent;
    if (node.parent === null) {
      this.root = rightChild;
    } else if (node === node.parent.left) {
      node.parent.left = rightChild;
    } else {
      node.parent.right = rightChild;
    }

    // node becomes rightChild's left child
    rightChild.left = node;
    node.parent = rightChild;
  }

  _rightRotate(node) {
    //        node          leftChild
    //        / \             /  \
    //  leftChild c          a   node
    //    / \                    / \
    //   a   b                  b   c

    const leftChild = node.left;
    if (leftChild === null) return;

    // Move leftChild's right subtree to node's left
    node.left = leftChild.right;
    if (leftChild.right !== null) {
      leftChild.right.parent = node;
    }

    // leftChild takes node's place in the tree
    leftChild.parent = node.parent;
    if (node.parent === null) {
      this.root = leftChild;
    } else if (node === node.parent.left) {
      node.parent.left = leftChild;
    } else {
      node.parent.right = leftChild;
    }

    // node becomes leftChild's right child
    leftChild.right = node;
    node.parent = leftChild;
  }

  // ──────────────────────────────────────────────
  //  HELPERS
  // ──────────────────────────────────────────────

  _findNode(value, startNode) {
    let current = startNode;

    while (current !== null) {
      if (value === current.value) return current;
      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return null;
  }

  _subtreeMin(node) {
    let current = node;
    while (current.left !== null) {
      current = current.left;
    }
    return current;
  }

  _subtreeMax(node) {
    let current = node;
    while (current.right !== null) {
      current = current.right;
    }
    return current;
  }

  // ──────────────────────────────────────────────
  //  VALIDATION
  // ──────────────────────────────────────────────

  _hasNoRedRedViolations(node) {
    if (node === null) return true;

    if (node.color === RED) {
      // A RED node must not have a RED child
      if (node.left?.color === RED || node.right?.color === RED) {
        return false;
      }
    }

    return (
      this._hasNoRedRedViolations(node.left) &&
      this._hasNoRedRedViolations(node.right)
    );
  }

  _computeBlackHeight(node) {
    if (node === null) return 1; // NIL nodes count as 1 BLACK

    const leftBH = this._computeBlackHeight(node.left);
    const rightBH = this._computeBlackHeight(node.right);

    // If either subtree is invalid, propagate the failure
    if (leftBH === -1 || rightBH === -1) return -1;

    // Both subtrees must have the same black-height
    if (leftBH !== rightBH) return -1;

    // Add 1 if this node is BLACK
    return leftBH + (node.color === BLACK ? 1 : 0);
  }
}

module.exports = RBT;
