/**
 * Represents a node in a Binary Search Tree.
 * Each node stores a value and references to left and right children.
 */
class Node {
  /**
   * Creates a new Node.
   * @param {*} value - The value to store in this node.
   * @param {Node|null} left - Reference to the left child node (default: null).
   * @param {Node|null} right - Reference to the right child node (default: null).
   */
  constructor(value, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

/**
 * Binary Search Tree (BST) implementation.
 * Supports standard BST operations: insert, search, delete, traversals,
 * and various utility methods like height, depth, findMin, findMax.
 *
 * !Time Complexity (average): O(log n) for insert/search/delete
 * !Time Complexity (worst): O(n) for skewed trees
 * !Space Complexity: O(n) for storing n nodes
 */
class BST {
  /**
   * Creates a new BST, optionally initialized with values.
   * @param {...*} items - Values to insert into the tree on creation.
   */
  constructor(...items) {
    this.root = null;
    this.nodeCount = 0;

    items?.forEach((item) => this.insert(item));
  }

  /**
   * Inserts a value into the BST.
   * Duplicate values are ignored (no insertion).
   *
   * !Time Complexity: O(h) where h = height of tree
   * !Space Complexity: O(h) for recursion stack
   *
   * @param {*} value - The value to insert.
   */
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

  /**
   * Searches for a value in the BST starting from a given node.
   *
   * !Time Complexity: O(h) where h = height of tree
   * !Space Complexity: O(h) for recursion stack
   *
   * @param {*} value - The value to search for.
   * @param {Node|null} [startingNode=this.root] - Node to start search from.
   * @returns {true|null} true if found, null if not found.
   */
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

  /**
   * Deletes a value from the BST.
   * Handles leaf nodes, single child nodes, and two-child nodes (using successor).
   *
   * !Time Complexity: O(h) where h = height of tree
   * !Space Complexity: O(h) for recursion stack
   *
   * @param {*} value - The value to delete.
   * @returns {boolean} true if deleted, false if value not found.
   */
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
    this.nodeCount--;
    return true;
  }

  /**
   * Finds the in-order successor (leftmost node) of a given node.
   * Used internally for delete operation when node has two children.
   *
   * !Time Complexity: O(h) in worst case
   * !Space Complexity: O(1)
   *
   * @param {Node} node - The node to find successor for (typically right child).
   * @returns {Node} The leftmost node in the subtree.
   */
  getSuccessorNode(node) {
    let temp = node;

    while (temp.left) {
      temp = temp.left;
    }

    return temp;
  }

  /**
   * Finds the minimum value in the BST.
   *
   * !Time Complexity: O(h) where h = height of tree
   * !Space Complexity: O(1)
   *
   * @returns {*|null} The minimum value, or null if tree is empty.
   */
  findMin() {
    if (this.root === null) return null;

    let temp = this.root;

    while (temp?.left !== null) {
      temp = temp.left;
    }

    return temp.value;
  }

  /**
   * Finds the maximum value in the BST.
   *
   * !Time Complexity: O(h) where h = height of tree
   * !Space Complexity: O(1)
   *
   * @returns {*|null} The maximum value, or null if tree is empty.
   */
  findMax() {
    if (this.root === null) return null;

    let temp = this.root;

    while (temp?.right !== null) {
      temp = temp.right;
    }

    return temp.value;
  }

  /**
   * Checks if the BST is empty.
   *
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   *
   * @returns {boolean} true if tree has no nodes, false otherwise.
   */
  isEmpty() {
    return this.root === null;
  }

  /**
   * Calculates the height of a subtree (number of nodes in longest path).
   *
   * !Time Complexity: O(n) - visits all nodes in subtree
   * !Space Complexity: O(h) for recursion stack
   *
   * @param {Node|null} [startingNode=this.root] - Root of subtree to measure.
   * @returns {number} Height in nodes (0 for null, 1 for leaf).
   */
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

  /**
   * Calculates the depth of a value from a starting node.
   * Depth = number of edges from starting node to target node.
   *
   * !Time Complexity: O(h) where h = height from starting node
   * !Space Complexity: O(h) for recursion stack
   *
   * @param {Node} startingNode - Node to start depth calculation from.
   * @param {*} value - The value to find depth for.
   * @returns {number} Depth in edges (0 if starting node has the value), or -1 if not found.
   */
  depth(startingNode, value) {
    const depthHelper = (root, value, depthSoFar) => {
      if (root === null) return -1;

      // If node found with value
      if (root.value === value) return depthSoFar;
      else if (value < root.value) {
        return depthHelper(root.left, value, depthSoFar + 1);
      } else {
        return depthHelper(root.right, value, depthSoFar + 1);
      }
    };

    return depthHelper(startingNode, value, 0);
  }

  /**
   * Returns the number of nodes in the BST.
   *
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   *
   * @returns {number} The node count.
   */
  size() {
    return this.nodeCount;
  }

  /**
   * Performs pre-order traversal (root, left, right) of a subtree.
   *
   * !Time Complexity: O(n) - visits all nodes
   * !Space Complexity: O(h) for recursion stack + O(n) for result array
   *
   * @param {Node|null} [root=this.root] - Root of subtree to traverse.
   * @returns {Array} Array of values in pre-order.
   */
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

  /**
   * Performs in-order traversal (left, root, right) of a subtree.
   * For BSTs, returns values in sorted ascending order.
   *
   * !Time Complexity: O(n) - visits all nodes
   * !Space Complexity: O(h) for recursion stack + O(n) for result array
   *
   * @param {Node|null} [root=this.root] - Root of subtree to traverse.
   * @returns {Array} Array of values in sorted order.
   */
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

  /**
   * Performs post-order traversal (left, right, root) of a subtree.
   *
   * !Time Complexity: O(n) - visits all nodes
   * !Space Complexity: O(h) for recursion stack + O(n) for result array
   *
   * @param {Node|null} [root=this.root] - Root of subtree to traverse.
   * @returns {Array} Array of values in post-order.
   */
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

  /**
   * Performs level-order traversal (BFS) of a subtree.
   * Visits nodes level by level from top to bottom, left to right.
   *
   * !Time Complexity: O(n) - visits all nodes
   * !Space Complexity: O(w) where w = max width of tree (queue size)
   *
   * @param {Node|null} [root=this.root] - Root of subtree to traverse.
   * @returns {Array} Array of values in level-order.
   */
  levelOrderTraversal(root = this.root) {
    if (root === null) return [];

    const results = [];

    // Initializing queue with root
    const queue = [root];

    while (queue.length > 0) {
      const currentNode = queue.shift();

      results.push(currentNode.value);

      if (currentNode.left !== null) {
        queue.push(currentNode.left);
      }

      if (currentNode.right !== null) {
        queue.push(currentNode.right);
      }
    }

    return results;
  }
}

module.exports = BST;
