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

        // Finding out the position of the key in the keys array
        while (keyIdx >= 0 && this.keys[keyIdx] > key) {
            // Shifting key to the right to make space for the new key
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

            // Promoting median to parent
            // Case 1: Insertion at root node (doesn't have parent)
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
            // Case 2: Inserting at leaf node
            // REWORK HERE
            else {
                this.parent.insert(medianKey);
                // isnert children to left and right of the index where median was inserted
                // update parent of children
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

        // Copying keys in left split portion to the left node 
        for (let i = 0; i < leftKeys.length; i++) {
            leftNode.keys[i] = leftKeys[i]
            leftNode.keyCount++;
        }

        const rightNode = new Node(this.order)
        const rightKeys = this.keys.slice(medianIdx + 1)

        // Copying keys in right split portion to the right node 
        for (let i = 0; i < rightKeys.length; i++) {
            rightNode.keys[i] = rightKeys[i];
            rightNode.keyCount++;
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

        // insert 1

        // 0 1 2 3 4 5
        // 2 4
        // keys:        1     2     3     4
        // children: [0] [1.1] [2.2] [3.3] [4.4]

        // Internal node
        // else {
        //     let i = 0;

        //     // Find the right key to get the child pointer
        //     while (i < root.keyCount && root.keys[i] < key) {

        //     }
        // }
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
                    return this.traverseToLeaf(root.children[i], key);
                }
            }

            // Searching the last child for keys
            return this.traverseToLeaf(root.children[root.keyCount], key);
        }
    }
}

// insert
// 1. isnert at root
// 2. find correct poisiont of key insert there. 
// 3. find correct node, insert there
// 3.1. IF node is overfilling, split it, push mid to parent 


module.exports = BTree