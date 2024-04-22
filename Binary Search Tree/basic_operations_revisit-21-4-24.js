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

    items?.forEach((item) => this.insertNode(item));
  }

  insertNode(value) {
    // console.log("inserting with", value);
    const insertNodeHelper = (root, value) => {
      if (root == null) {
        return new Node(value);
      }

      if (root.value < value) {
        root.right = insertNodeHelper(root.right, value);
      } else if (root.value > value) {
        root.left = insertNodeHelper(root.left, value);
      }

      return root;
    };

    this.root = insertNodeHelper(this.root, value);
  }

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

    console.log("Preorder Tranversal:", preOrderTraversalHelper(this.root));
  }

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

    console.log("Inorder Tranversal:", inOrderTraversalHelper(this.root));
  }

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

    console.log("Postorder Tranversal:", postOrderTraversalHelper(this.root));
  }

  getSmallestNode(root) {
    let temp = root;
    while (temp?.left) {
      temp = temp.left;
    }

    return temp;
  }

  removeNode(removeVal) {
    const removeNodeHelper = (root, value) => {
      if (root == null) {
        return root;
      }

      if (root.value < value) {
        root.right = removeNodeHelper(root.right, value);
      } else if (root.value > value) {
        root.left = removeNodeHelper(root.left, value);
      } else {
        if (root.left == null && root.right == null) {
          root = null;
        } else if (root.left == null) {
          root = root.right;
        } else if (root.right == null) {
          root = root.left;
        } else {
          let newNode = this.getSmallestNode(root);

          root.value = newNode.value;

          root.right = removeNodeHelper(root.right, newNode.value);
        }
      }

      return root;
    };

    this.root = removeNodeHelper(this.root, removeVal);
  }

  diameter() {
    let maxDiameter = 0;
    const heightHelper = (root) => {
      if (root == null) {
        return 0;
      }
      let leftHeight = heightHelper(root.left);
      let rightHeight = heightHelper(root.right);
      let height = 1 + Math.max(leftHeight, rightHeight);

      maxDiameter = Math.max(maxDiameter, leftHeight + rightHeight);
      return height;
    };

    heightHelper(root, 0);
    return maxDiameter;
  }

  topView() {
    if (this.root == null) {
      return [];
    }

    let levelMap = new Map(),
      bfsQueue = [[this.root, 0]];

    while (bfsQueue.length) {
      let [currNode, currLevel] = bfsQueue.shift();

      if (currNode.left) {
        bfsQueue.push([currNode.left, currLevel - 1]);
      }

      if (currNode.right) {
        bfsQueue.push([currNode.right, currLevel + 1]);
      }

      if (levelMap.has(currLevel)) {
        let levelNodes = levelMap.get(currLevel);
        levelNodes.push(currNode.value);
        levelMap.set(currLevel, levelNodes);
      } else {
        levelMap.set(currLevel, [currNode.value]);
      }
    }

    let mapEntries = [...levelMap.entries()].sort((a, b) => a[0] - b[0]);
    const results = mapEntries.map((a) => a[1][0]);

    return results;
  }
}

const tree = new BST(3, 1, 2, 4, 5);
tree.preOrderTraversal();
tree.inOrderTraversal();
tree.postOrderTraversal();

// tree.removeNode(4);

// tree.preOrderTraversal();
// tree.inOrderTraversal();
// tree.postOrderTraversal();

tree.topView();
