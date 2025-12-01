class Node {
    constructor(value, next = null) {
        this.value = value;
        this.next = next;
    }
}

class LinkedList {
    constructor(...items) {
        this.head = null;
        this.tail = null;
        this.nodeCount = 0;

        items?.forEach(item => this.insertAtTail(item));
    }

    insertAtHead(val) {
        const newNode = new Node(val);

        if (this.head === null) {
            this.head = newNode;
            this.tail = this.head;
        }
        else {
            newNode.next = this.head;
            this.head = newNode;
        }

        this.nodeCount++;
    }

    insertAtTail(val) {
        const newNode = new Node(val)
        if (this.head === null) {
            this.head = newNode
            this.tail = this.head;
        }
        else {
            this.tail.next = newNode;
            this.tail = newNode
        }

        this.nodeCount++;
    }

    removeHead() {
        if (this.size() === 0) return null;

        let removedNodeVal;

        if (this.head.next === null) {
            removedNodeVal = this.head.value;
            this.head = null
            this.tail = null
        }
        else {
            removedNodeVal = this.head.value;
            this.head = this.head.next
        }

        this.nodeCount--;

        return removedNodeVal;
    }

    removeTail() {
        if (this.size() === 0) return null;

        let removedNodeVal;

        if (this.head.next === null) {
            removedNodeVal = this.head.value;
            this.head = null
            this.tail = null
        }
        else {
            let temp = this.head, prev = null;

            while (temp.next !== null) {
                prev = temp;
                temp = temp.next
            }

            removedNodeVal = temp.value;
            // Updating the tail and making its next value null, i.e, deleting the tail node
            this.tail = prev
            this.tail.next = null;
        }

        this.nodeCount--;

        return removedNodeVal;
    }

    removeByValue(val) {
        if (this.size() === 0) return null;

        let curr = this.head, prev = null;
        let removeNodeVal = null;

        // Traverse the list to find the node by value
        while (curr !== null) {
            if (curr.value === val) {
                removeNodeVal = curr.value;

                // If head node
                if (prev === null) {
                    this.head = this.head.next

                    // Checking if the linked list is now empty
                    if (!this.head) {
                        this.tail = null;
                    }
                }
                else if (prev?.next) {
                    // Link the previous node to the next node, effectively removing the current node
                    prev.next = curr.next

                    // Updating the tail and making its next value null if the remove node was the old tail node
                    if (!curr.next) {
                        this.tail = prev
                        this.tail.next = null;
                    }
                }
                break;
            }

            prev = curr;
            curr = curr.next
        }


        // Reducing node count if a node by the value is found to delete
        if (removeNodeVal !== null) this.nodeCount--;

        return removeNodeVal;
    }

    find(val) {
        let foundNode = null, curr = this.head;

        while (curr) {
            if (curr.value === val) {
                foundNode = curr;
                break;
            }

            curr = curr.next;
        }

        return foundNode
    }

    reverse() {}

    getHead() {
        return this.head
    }

    getTail() {
        return this.tail;
    }

    size() {
        return this.nodeCount;
    }

    isEmpty() {
        return this.nodeCount === 0;
    }

    toArray() {
        let temp = this.head;
        const results = [];

        while (temp != null) {
            results.push(temp.value)
            temp = temp.next;
        }

        return results
    }
}

module.exports = LinkedList