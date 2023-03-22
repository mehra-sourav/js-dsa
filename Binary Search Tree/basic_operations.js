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

    items?.forEach((item) => {
      let newNode = new Node(item);
      if (this.root == null) {
        this.root = newNode;
      } else {
        this.root = this.insertNode(this.root, item);
      }
    });
  }

  /**
   * Inserts a new node to the binary search tree
   * !Time Complexity: O(logn)
   * !Space Complexity: O(1)
   * @param {Node} root - The root node of the tree where the new node
   * will be inserted
   * @param {number} val - The value of the new node that will be inserted
   */
  insertNode(root, val) {
    if (root == null) {
      return new Node(val);
    }

    if (root.value < val) {
      root.right = this.insertNode(root.right, val);
    } else if (root.value > val) {
      root.left = this.insertNode(root.left, val);
    }

    return root;
  }

  /**
   * Traverses a binary search tree using breadth first search algorithm
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
   * Traverses a binary search tree using preorder algorithm
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
   * Traverses a binary search tree using inorder algorithm
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
   * Traverses a binary search tree using postorder algorithm
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

  // insert --> done
  // bfs --> done
  // preorder --> done
  // inorder --> done
  // postorder --> done
  // remove
  // search
}

// const tree = new BST(1, 2, 3, 4, 5);
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
