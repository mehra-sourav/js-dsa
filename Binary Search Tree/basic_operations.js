/**
 * Class for creating a new tree node
 */
class Node {
  constructor(val, left = null, right = null) {
    this.value = val;
    this.left = left;
    this.right = right;
  }
}

/**
 * Class for creating a new binary search tree
 */
class BST {
  constructor(...items) {
    this.root = null;

    items?.forEach((item) => this.insertNode(item));
  }

  /**
   * Inserts a new node to the binary search tree
   * !Time Complexity: O(logn)
   * !Space Complexity: O(1)
   * @param {Node} root - The root node of the tree where the new node
   * will be inserted
   * @param {number} value - The value of the new node that will be inserted
   */
  insertNode(value) {
    const insertNodeHelper = (root, val) => {
      if (root == null) {
        return new Node(val);
      }

      if (root.value < val) {
        root.right = insertNodeHelper(root.right, val);
      } else if (root.value > val) {
        root.left = insertNodeHelper(root.left, val);
      }

      return root;
    };
    this.root = insertNodeHelper(this.root, value);
  }

  /**
   * Traverses the binary search tree using breadth first search algorithm
   * !Time Complexity: O(n)
   * !Space Complexity: O(1)
   */
  bfsTraversal() {
    if (this.root == null) {
      console.log("Tree is empty!!");
      return;
    }
    let traversedNodes = [],
      queue = [this.root];

    // Keep traversing until queue is empty
    while (queue.length) {
      let currNode = queue.shift();

      // Push root node of left subtree to queue (if it exists)
      if (currNode.left) {
        queue.push(currNode.left);
      }

      // Push root node of right subtree to queue (if it exists)
      if (currNode.right) {
        queue.push(currNode.right);
      }

      traversedNodes.push(currNode.value);
    }

    console.log("BFS Traversal:", traversedNodes);
  }

  /**
   * Traverses the binary search tree using preorder algorithm
   * !Time Complexity: O(n)
   * !Space Complexity: O(1)
   */
  preOrderTraversal() {
    const preOrderTraversalHelper = (root) => {
      if (root == null) {
        return [];
      }

      return [
        root.value,
        ...preOrderTraversalHelper(root.left),
        ...preOrderTraversalHelper(root.right),
      ];
    };
    console.log("Preorder traversal:", preOrderTraversalHelper(this.root));
  }

  /**
   * Traverses the binary search tree using inorder algorithm
   * !Time Complexity: O(n)
   * !Space Complexity: O(1)
   */
  inOrderTraversal() {
    const inOrderTraversalHelper = (root) => {
      if (root == null) {
        return [];
      }

      return [
        ...inOrderTraversalHelper(root.left),
        root.value,
        ...inOrderTraversalHelper(root.right),
      ];
    };
    console.log("Inorder traversal:", inOrderTraversalHelper(this.root));
  }

  /**
   * Traverses the binary search tree using postorder algorithm
   * !Time Complexity: O(n)
   * !Space Complexity: O(1)
   */
  postOrderTraversal() {
    const postOrderTraversalHelper = (root) => {
      if (root == null) {
        return [];
      }

      return [
        ...postOrderTraversalHelper(root.left),
        ...postOrderTraversalHelper(root.right),
        root.value,
      ];
    };
    console.log("Postorder traversal:", postOrderTraversalHelper(this.root));
  }

  /**
   * Finds the node with the provided value in the binary search tree
   * !Time Complexity: O(logn)
   * !Space Complexity: O(1)
   * @param {number} val The value of the node which needs to be searched for
   * @returns {(Node|null)} The node with the provided value as its value or null
   */
  search(val) {
    const searchHelper = (root, val) => {
      if (root == null) {
        return null;
      }

      if (root.value < val) {
        return searchHelper(root.right, val);
      } else if (root.value > val) {
        return searchHelper(root.left, val);
      } else {
        return root;
      }
    };

    let node = searchHelper(this.root, val);
    if (node) {
      console.log("Node found!!:", node);
    } else {
      console.log("Node not found!!");
    }
  }

  /**
   * Finds the smallest node in a binary search tree given its root node
   * !Time Complexity: O(logn)
   * !Space Complexity: O(1)
   * @param {Node} root - The root node of the tree whose smallest node needs
   * to be found
   * @returns {Node} The smallest node of the tree whose root node was given
   */
  findSmallestNode(root) {
    while (root?.left) {
      root = root.left;
    }
    return root;
  }

  /**
   * Removes a node from the binary search tree
   * !Time Complexity: O(logn)
   * !Space Complexity: O(1)
   * @param {Node} root - The root node of the tree from which node will be
   * deleted
   * @param {number} val - The value of the node that will be deleted
   */
  removeNode(value) {
    const removeNodeHelper = (root, val) => {
      // Return root if it's null
      if (root == null) {
        return root;
      }

      // Delete from right subtree
      if (root.value < val) {
        root.right = removeNodeHelper(root.right, val);
      }
      // Delete from left subtree
      else if (root.value > val) {
        root.left = removeNodeHelper(root.left, val);
      }
      // Node found
      else {
        // Case 1 (Node to be deleted is a leaf node)
        if (root.left == null && root.right == null) {
          root = null;
        }
        // Case 2 (Node to be deleted has no left subtree)
        else if (root.left == null) {
          root = root.right;
        }
        // Case 2 (Node to be deleted has no right subtree)
        else if (root.right == null) {
          root = root.left;
        }
        // Case 3 (Node to be deleted has subtrees on both sides)
        else {
          // Find a replacement node (smallest node in right subtree or
          // largest node in left subtree)
          let replacementNode = this.findSmallestNode(root.right);

          // Replace to be deleted node's value with replacement node's value
          root.value = replacementNode.value;

          // Delete replacement node from the right subtree
          root.right = removeNodeHelper(root.right, val);
        }
      }
      return root;
    };

    this.root = removeNodeHelper(this.root, value);
  }

  // insert --> done
  // bfs --> done
  // preorder --> done
  // inorder --> done
  // postorder --> done
  // search --> done
  // remove --> done
  // avl transformations left
}

/*
        3
    1       4
        2       5
*/

const tree = new BST(3, 1, 2, 4, 5);

tree.bfsTraversal();
tree.preOrderTraversal(tree.root);
tree.inOrderTraversal(tree.root);
tree.postOrderTraversal(tree.root);
tree.search(4);

tree.removeNode(4);

tree.bfsTraversal();
tree.preOrderTraversal(tree.root);
tree.inOrderTraversal(tree.root);
tree.postOrderTraversal(tree.root);
