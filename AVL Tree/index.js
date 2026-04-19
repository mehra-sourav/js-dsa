class Node {
    constructor(value, left = null, right = null, parent = null, balance = 0) {
        this.value = value;
        this.left = left;
        this.right = right;
        this.parent = parent;
    }
}

class AVLTree {
    constructor(...items) {
        this.root = null;
        this.nodeCount = 0;

        items?.forEach((item) => this.insert(item));
    }

    insert(value) {
        const newNode = new Node(value);
        const insertHelper = (root, newNode, parent = null) => {
            if (root === null) {
                this.nodeCount++;
                newNode.parent = parent;
                return newNode;
            }
            else if (value < root.value) {
                root.left = insertHelper(root.left, newNode, root)

            }
            else if (root.value < value) {
                root.right = insertHelper(root.right, newNode, root)
            }

            this.fixImbalance(root, newNode);
            return root;
        }

        this.root = insertHelper(this.root, newNode, null);
    }

    search(value) {
        const searchHelper = (root, value) => {
            if (value < root.value) {
                return searchHelper(root.left, value);
            }
            else if (root.value < value) {
                return searchHelper(root.right, value);
            }
            else if (root.value === value) {
                return true;
            }

            return false;
        }

        return searchHelper(this.root, value);
    }

    updateNodeBalance(root) {
        const leftHeight = this.height(root.left);
        const rightHeight = this.height(root.right);

        root.balance = leftHeight - rightHeight
    }

    fixImbalance(node, newNode) {
        const nodeBalance = this.getBalance(node);
        
        // Early return if node is not imbalanced
        if (-1 <= nodeBalance && nodeBalance <= 1) return;


        // Perform rotations
        // Case 1: LL Rotation
        if (nodeBalance > 1 && newNode.value < node?.left?.value) {
            this._rightRotate(node);
        }
        // // Case 2: LR Rotation
        else if (nodeBalance > 1 && node?.left?.value < newNode.value) {
            this._leftRotate(node.left);
            this._rightRotate(node);
        }
        // // Case 3: RR Rotation
        else if (nodeBalance < -1 && node?.right?.value < newNode.value) {
            this._leftRotate(node)
        }
        // // Case 4: RL Rotation
        else if (nodeBalance < -1 && newNode.value < node?.right?.value) {
            this._rightRotate(node.right)
            this._leftRotate(node);
        }

    }

    _rightRotate(node) {
        const originalParent = node.parent;
        const isLeftChild = originalParent?.left === node;
        
        const leftChild = node?.left;

        // Making left node's right child the new left child of node
        node.left = leftChild?.right;

        // If node's new left child is non-null
        if (node?.left) {
            node.left.parent = node;
        }
        
        leftChild.right = node;

        // Switching parents
        [leftChild.parent, node.parent] = [node.parent, leftChild];

        // Updating the parent's linkage to the new node
        if (originalParent) {
            if (isLeftChild) {
                originalParent.left = leftChild;
            }
            else {
                originalParent.right = leftChild;
            }
        }
        // If parent is null, that means node is root
        else {
            this.root = leftChild;
        }

        //           A
        //         /   \
        //       B       C     
        //     /   \
        //   D       E

        //           ||

        //           B
        //         /   \
        //       D       A     
        //             /    \
        //           E        C



    }

    _leftRotate(node) {
        const originalParent = node?.parent;
        const isRightChild = originalParent?.right === node;
        const rightChild = node?.right;

        node.right = rightChild?.left;

        // If node's new right child is non-null, then update the parent linkage
        if (node?.right) {
            node.right.parent = node;
        }

        rightChild.left = node;

        // Switching parents
        [rightChild.parent, node.parent] = [node.parent, rightChild];

        // Updating the linkage of the original parent to the new node (rightChild) that is replacing the node
        if (originalParent) {
            if (isRightChild) {
                originalParent.right = rightChild;
            }
            else {
                originalParent.left = rightChild;
            }
        }
        // The node was the root, so make right child the new root directly
        else {
            this.root = rightChild;
        }

        

        //           B
        //         /   \
        //       D       A     
        //             /    \
        //           E        C

        //           ||

        //           A
        //         /   \
        //       B       C     
        //     /   \
        //   D       E

        



    }

    getBalance(node = this.root) {
        return this.height(node?.left) - this.height(node?.right);
    }

    isEmpty() {
        return this.nodeCount === 0;
    }

    size() {
        return this.nodeCount;
    }

    height(root = this.root) {
        const heightHelper = (root) => {
            if (root === null) {
                return 0;
            }

            const leftHeight = heightHelper(root.left);
            const rightHeight = heightHelper(root.right);

            return 1 + Math.max(leftHeight, rightHeight);
        }

        return heightHelper(root);
    }
}

module.exports = AVLTree