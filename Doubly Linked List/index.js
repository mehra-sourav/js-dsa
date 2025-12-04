class Node {
    constructor(value, prev = null, next = null) {
        this.value = value;
        this.prev = prev;
        this.next = next;
    }
}

class DoublyLinkedList {
    constructor(...items) {
        this.head = null;
        this.tail = null;
        this.nodeCount = 0;

        items?.forEach(item => this.insertAtTail(item))
    }

    insertAtHead(item) {
        const newNode = new Node(item)

        if (this.head === null) {
            this.head = this.tail = newNode;
        }
        else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode
        }

        this.nodeCount++;

    }

    insertAtTail(item) {
        const newNode = new Node(item);

        if (this.head === null) {
            this.head = this.tail = newNode;
        }
        else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }

        this.nodeCount++;
    }

    removeHead() {
        if (this.size() === 0) return null;

        let removedNodeVal = null;

        if (this.head.next === null) {
            removedNodeVal = this.head.value;
            this.head = null
            this.tail = null
        }
        else {
            removedNodeVal = this.head.value;
            this.head = this.head.next;
            this.head.prev = null;
        }

        this.nodeCount--;

        return removedNodeVal
    }

    removeTail() {
        if (this.size() === 0) return null;

        let removedNodeVal;

        if (this.tail.prev === null) {
            removedNodeVal = this.tail.value;
            this.head = null
            this.tail = null
        }
        else {
            removedNodeVal = this.tail.value;
            this.tail = this.tail.prev;
            this.tail.next = null;
        }

        this.nodeCount--;

        return removedNodeVal
    }

    removeByValue(val) {
        if (this.size() === 0) return null;

        let current = this.head, removedNodeVal = null;

        // Traverse the list to find the node by value
        while (current) {
            if (current.value === val) {
                removedNodeVal = current.value;

                // If found node is at head
                if (!current.prev) {
                    this.head = current.next

                    // Checking if linked list has not become empty
                    if (this.head) {
                        this.head.prev = null;
                    }
                    else {
                        this.tail = null;
                    }
                }
                else if (!current.next) {

                }
                // Node is in middle of linked list
                else {
                    // Making the next node of current node the next of previous node
                    current.prev.next = current.next;

                    // Making the previous node of current node the previous of next node
                    current.next.prev = current.prev
                }
                
                break;
            }

            current = current.next;
        }

        return removedNodeVal;
    }

    getHead() {
        return this.head;
    }

    getTail() {
        return this.tail;
    }

    toArray() {
        let current = this.head;
        const results = [];

        while(current) {
            results.push(current.value);
            current = current.next;
        }

        return results
    }

    size() {
        return this.nodeCount;
    }
}

module.exports = DoublyLinkedList