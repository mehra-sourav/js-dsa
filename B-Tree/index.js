class Node {
    constructor(order, isLeaf) {
        this.order = order;
        this.keys = new Array(order - 1).fill(null);
        this.children = new Array(order).fill(null);
        this.keyCount = 0;
        this.isLeaf = isLeaf;
    }
}

class BTree {
    constructor(order) {
        this.order = order;
        this.root = null;
    }

    insert(key) {
        const insertHelper = (root, key) => {
            if (!root) {
                const newNode = new Node(this.order, true);
                newNode.keys[0] = key;
                return newNode;
            }
            else if (root.isLeaf) {

                // This in if leaf node
                let i = this.root.keyCount - 1;

                // Finding out the key which is smaller than the valkeyue to be inserted
                while (i >= 0 && this.root.keys[i] > key) {
                    // Shifting key to the right to make space for the new key
                    this.root.keys[i + 1] = this.root.keys[i]
                    i--;
                }

                // Inserting key at correct position
                root.keys[i + 1] = key;
                root.keyCount++;


                // insert 1

                // 0 1 2 3 4 5
                // 2 3 4
            }
            // Internal node
            else {
                // find 
            }
        }
        this.root = insertHelper(this.root, key)
    }
}

// insert
// 1. isnert at root
// 2. find correct poisiont of key insert there. 
// 3. find correct node, insert there
// 3.1. IF node is overfilling, split it, push mid to parent 