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
        this.size = 0;

        items?.forEach(item => this.insert(item))
    }

    insert(value) {
        const insertHelper = (root, val) => {
            if (root === null) {
                return new Node(value)
            }
            else if (value < root.value) {
                root.left = insertHelper(root.left, val)
            }
            else if (root.value < val) {
                root.right = insertHelper(root.right, val)
            }
        }

        this.root = insertHelper(this.root, value)
    }

    preOrderTraversal(root = this.root) {
        if (root === null) {
            return []
        }

        return [
            root.value,
            ...this.preOrderTraversal(root.left),
            ...this.preOrderTraversal(root.right)
        ]
    }

    inOrderTraversal(root = this.root) {
        if (root === null) {
            return []
        }

        return [
            ...this.preOrderTraversal(root.left),
            root.value,
            ...this.preOrderTraversal(root.right)
        ]
    }

    postOrderTraversal(root = this.root) {
        if (root === null) {
            return []
        }

        return [
            ...this.preOrderTraversal(root.left),
            ...this.preOrderTraversal(root.right),
            root.value
        ]
    }
}