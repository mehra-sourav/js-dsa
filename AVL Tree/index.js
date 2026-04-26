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

            root = this._fixImbalanceInsertion(root, newNode);
            return root;
        }

        this.root = insertHelper(this.root, newNode, null);
    }

    delete(value) {
        if (!this.search(value)) return false;

        const deleteHelper = (root, value) => {
            if (root === null) {
                return root;
            }

            if (value < root?.value) {
                root.left = deleteHelper(root.left, value);
            }
            else if (root?.value < value) {
                root.right = deleteHelper(root.right, value);
            }
            else {
                // Node to be deleted is a leaf node
                if (root.left === null && root.right === null) {
                    if (root.parent) {
                        this._updateParent(root, null);
                    }
                    root = null;
                }
                // Node to be deleted has left descendants, but not right
                else if (root.left !== null && root.right === null) {
                    const newRoot = root.left;
                    newRoot.parent = root.parent;

                    if (root.parent) {
                        this._updateParent(root, newRoot);
                    }

                    root = newRoot;
                }
                // Node to be deleted has right descendants, but not left
                else if (root.left === null && root.right !== null) {
                    const newRoot = root.right;
                    newRoot.parent = root.parent;

                    if (root.parent) {
                        this._updateParent(root, newRoot);
                    }

                    root = newRoot;
                }
                // Node has left and right descendants
                else {
                    const replacementNode = this._getMin(root.right);

                    root.value = replacementNode.value;

                    // Deleting replacement node
                    root.right = deleteHelper(root.right, replacementNode.value);
                }
            }

            root = this._fixImbalanceDeletion(root);
            return root;
        }

        this.root = deleteHelper(this.root, value);
        this.nodeCount--;
        return true;
    }

    search(value) {
        const searchHelper = (root, value) => {
            if (value < root?.value) {
                return searchHelper(root.left, value);
            }
            else if (root?.value < value) {
                return searchHelper(root.right, value);
            }
            else if (root?.value === value) {
                return true;
            }

            return null;
        }

        return searchHelper(this.root, value);
    }

    updateNodeBalance(root) {
        const leftHeight = this.height(root.left);
        const rightHeight = this.height(root.right);

        root.balance = leftHeight - rightHeight
    }

    _fixImbalanceInsertion(node, newNode) {
        const nodeBalance = this.getBalance(node);

        // Early return if node is not imbalanced
        if (-1 <= nodeBalance && nodeBalance <= 1) return node;

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
            this._leftRotate(node);
        }
        // // Case 4: RL Rotation
        else if (nodeBalance < -1 && newNode.value < node?.right?.value) {
            this._rightRotate(node.right)
            this._leftRotate(node);
        }

        return node.parent;
    }

    _fixImbalanceDeletion(node) {
        const nodeBalance = this.getBalance(node);
        const leftNodeBalance = this.getBalance(node?.left);
        const rightNodeBalance = this.getBalance(node?.right);

        // Early return if node is not imbalanced
        if (-1 <= nodeBalance && nodeBalance <= 1) return node;

        // Perform rotations
        // Case 1: LL Rotation
        if (nodeBalance > 1 && leftNodeBalance >= 0) {
            this._rightRotate(node);
        }
        // // Case 2: LR Rotation
        else if (nodeBalance > 1 && leftNodeBalance < 0) {
            this._leftRotate(node.left);
            this._rightRotate(node);
        }
        // // Case 3: RR Rotation
        else if (nodeBalance < -1 && rightNodeBalance <= 0) {
            this._leftRotate(node);
        }
        // // Case 4: RL Rotation
        else if (nodeBalance < -1 && rightNodeBalance > 0) {
            this._rightRotate(node.right)
            this._leftRotate(node);
        }

        return node.parent;
    }

    _getMin(root) {
        let temp = root;

        while (temp?.left) {
            temp = temp?.left;
        }
        return temp;
    }

    _updateParent(root, newNode) {
        const isLeftChild = root.parent.left === root;
        if (isLeftChild) {
            root.parent.left = newNode;
        }
        else {
            root.parent.right = newNode;
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

    printTree() {
        if (!this.root) { console.log('(empty)'); return; }

        // Assign x-slot to each node via in-order traversal
        const pos = new Map();
        let idx = 0;
        const assignPos = (node) => {
            if (!node) return;
            assignPos(node.left);
            pos.set(node, idx++);
            assignPos(node.right);
        };
        assignPos(this.root);

        const W = 4; // chars per slot
        const total = idx;

        // Collect nodes level by level (BFS)
        const levels = [];
        let queue = [this.root];
        while (queue.length) {
            levels.push(queue);
            queue = queue.flatMap(n => [n.left, n.right].filter(Boolean));
        }

        const lines = [];
        for (let d = 0; d < levels.length; d++) {
            const nodeLine = Array(total * W).fill(' ');
            const edgeLine = Array(total * W).fill(' ');

            for (const node of levels[d]) {
                const cx = pos.get(node) * W + Math.floor(W / 2);
                const label = String(node.value);
                const start = cx - Math.floor(label.length / 2);
                label.split('').forEach((ch, i) => nodeLine[start + i] = ch);

                if (node.left) edgeLine[pos.get(node.left) * W + Math.floor(W / 2)] = '/';
                if (node.right) edgeLine[pos.get(node.right) * W + Math.floor(W / 2)] = '\\';
            }

            lines.push(nodeLine.join('').trimEnd());
            if (d < levels.length - 1) lines.push(edgeLine.join('').trimEnd());
        }

        console.log(lines.join('\n'));
    }
}

module.exports = AVLTree