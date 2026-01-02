class Node {
    constructor(order, parent = null) {
        this.order = order;
        this.keys = new Array(order - 1).fill(null);
        this.children = new Array(order).fill(null);
        this.keyCount = 0;
        this.parent = parent;
    }

    insert(key) {
        let keyIdx = this.keyCount - 1;

        // Shifting key to the right to make space for the new key
        while (keyIdx >= 0 && this.keys[keyIdx] > key) {
            this.keys[keyIdx + 1] = this.keys[keyIdx]
            keyIdx--;
        }

        // Inserting key at correct position
        this.keys[keyIdx + 1] = key;
        this.keyCount++;

        // Split node if it is full
        if (this.keyCount === this.order) {
            // Splitting node
            const { medianKey, leftNode, rightNode } = this.splitAtMedian();

            // Promoting median key to parent
            // Case 1: Root node (doesn't have parent)
            if (!this.parent) {
                const newRoot = new Node(this.order);
                newRoot.keys[0] = medianKey
                newRoot.keyCount++;
                newRoot.children[0] = leftNode
                newRoot.children[1] = rightNode

                // Updating parent of children
                leftNode.parent = newRoot;
                rightNode.parent = newRoot;

                return newRoot;
            }
            // Case 2: Leaf node
            else if (this.isLeaf()) {
                let newParent = this.parent.insert(medianKey);
                const medianIdxInParent = this.parent.keys.indexOf(medianKey)

                let childIdx = this.parent.children.length - 2;

                // Shifting old children to the right to make space for the new children
                while (childIdx > medianIdxInParent) {
                    this.parent.children[childIdx + 1] = this.parent.children[childIdx]
                    childIdx--;
                }

                // Updating parent of new children
                leftNode.parent = newParent ?? this.parent
                rightNode.parent = newParent ?? this.parent;

                // New root was created
                if (newParent) {
                    newParent.children[0] = leftNode
                    newParent.children[1] = rightNode
                }
                else {
                    this.parent.children[medianIdxInParent] = leftNode
                    this.parent.children[medianIdxInParent + 1] = rightNode
                }

                return newParent;
            }
            // Case 3: Internal node
            else {
                let parent = this.parent;

                if (!parent) {
                    const newRoot = new Node(this.order);
                    newRoot.keys[0] = medianKey
                    newRoot.keyCount++;
                    newRoot.children[0] = leftNode
                    newRoot.children[1] = rightNode

                    // Updating parent of children
                    leftNode.parent = newRoot;
                    rightNode.parent = newRoot;

                    parent = this.parent = newRoot;
                }


                const medianIdxInParent = this.parent.keys.indexOf(medianKey)

                let childIdx = this.parent.children.length - 2;

                // Shifting old children to the right to make space for the new children
                while (childIdx > medianIdxInParent) {
                    this.parent.children[childIdx + 1] = this.parent.children[childIdx]
                    childIdx--;
                }

                // Updating parent of new children
                leftNode.parent = this.parent
                rightNode.parent = this.parent;

                this.parent.children[medianIdxInParent] = leftNode
                this.parent.children[medianIdxInParent + 1] = rightNode
            }
        }

        return null;
    }

    splitAtMedian() {
        // split left keys and left children
        // split right keys and children
        const medianIdx = Math.floor((this.keyCount - 1) / 2);
        const leftNode = new Node(this.order);
        const leftKeys = this.keys.slice(0, medianIdx)
        const leftChildren = this.children.slice(0, medianIdx + 1)

        // Copying keys in left split portion to the left node 
        for (let i = 0; i < leftKeys.length; i++) {
            leftNode.keys[i] = leftKeys[i]
            leftNode.keyCount++;
        }

        // Copying children in left split portion to the left node 
        for (let i = 0; i < leftChildren.length; i++) {
            leftNode.children[i] = leftChildren[i];
        }

        const rightNode = new Node(this.order)
        const rightKeys = this.keys.slice(medianIdx + 1)
        const rightChildren = this.children.slice(medianIdx + 2)

        // Copying keys in right split portion to the right node 
        for (let i = 0; i < rightKeys.length; i++) {
            rightNode.keys[i] = rightKeys[i];
            rightNode.keyCount++;
        }

        // Copying children in right split portion to the right node 
        for (let i = 0; i < rightChildren.length; i++) {
            rightNode.children[i] = rightChildren[i];
        }

        return { medianKey: this.keys[medianIdx], leftNode, rightNode }
    }

    isLeaf() {
        return this.children.every(item => item === null);
    }
}

class BTree {
    constructor(order) {
        this.order = order;
        this.root = null;
    }

    insert(key) {
        // If root node is null
        if (!this.root) {
            this.root = new Node(this.order);
            this.root.keys[0] = key;
            this.root.keyCount++;

            return this.root
        }

        // Early return if key already exists in B-Tree
        if (this.search(key, true)) {
            return false;
        }

        // Find out the node in which key needs to be inserted
        const targetNode = this.search(key, false)
        // targetNode.insert(key)

        const newRoot = targetNode.insert(key);  // returns root OR null
        if (newRoot) {
            this.root = newRoot;
        }
        return this.root;
    }

    // Searches for a key in B-Tree. strictMatch searches for node containing key
    search(key, strictMatch = true) {
        if (!this.root) {
            return false
        }

        return this.traverseToLeaf(this.root, key, strictMatch)
    }

    // Recursively traverses to the leaf where key belongs
    traverseToLeaf(root, key, strictMatch) {
        // If current node contains the key as one of its keys
        if (root.keys.includes(key)) {
            return root;
        }
        // If current node is a leaf node
        else if (root.isLeaf()) {
            if (strictMatch) return false;
            return root;
        }
        // Find and search the appropriate child which may contain the key
        else {
            for (let i = 0; i < root.keyCount; i++) {
                if (key < root.keys[i]) {
                    return this.traverseToLeaf(root.children[i], key, strictMatch);
                }
            }

            // Searching the last child for keys
            return this.traverseToLeaf(root.children[root.keyCount], key, strictMatch);
        }
    }
}

// insert
// 1. isnert at root
// 2. find correct poisiont of key insert there. 
// 3. find correct node, insert there
// 3.1. IF node is overfilling, split it, push mid to parent 


module.exports = BTree