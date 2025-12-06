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

    items?.forEach((item) => this.insertAtTail(item));
  }

  insertAtHead(item) {
    const newNode = new Node(item);

    if (this.head === null) {
      this.head = this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }

    this.nodeCount++;
  }

  insertAtTail(item) {
    const newNode = new Node(item);

    if (this.head === null) {
      this.head = this.tail = newNode;
    } else {
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
      this.head = null;
      this.tail = null;
    } else {
      removedNodeVal = this.head.value;
      this.head = this.head.next;
      this.head.prev = null;
    }

    this.nodeCount--;

    return removedNodeVal;
  }

  removeTail() {
    if (this.size() === 0) return null;

    let removedNodeVal;

    if (this.tail.prev === null) {
      removedNodeVal = this.tail.value;
      this.head = null;
      this.tail = null;
    } else {
      removedNodeVal = this.tail.value;
      this.tail = this.tail.prev;
      this.tail.next = null;
    }

    this.nodeCount--;

    return removedNodeVal;
  }

  removeByValue(val) {
    if (this.size() === 0) return null;

    let current = this.head,
      removedNodeVal = null;

    // Traverse the list to find the node by value
    while (current) {
      if (current.value === val) {
        removedNodeVal = current.value;

        // If found node is at head
        if (!current.prev) {
          this.head = current.next;

          // Checking if linked list has not become empty
          if (this.head) {
            this.head.prev = null;
          } else {
            this.tail = null;
          }
        }
        // If node is at end of list
        else if (!current.next) {
          this.tail = this.tail.prev;
          this.tail.next = null;
        }
        // Node is in middle of linked list
        else {
          // Making the next node of current node the next of previous node
          current.prev.next = current.next;

          // Making the previous node of current node the previous of next node
          current.next.prev = current.prev;
        }

        break;
      }

      current = current.next;
    }

    // Reducing node count if a node to be deleted is found
    if (removedNodeVal) this.nodeCount--;

    return removedNodeVal;
  }

  find(val) {
    let foundNode = null,
      current = this.head;

    while (current) {
      if (current.value === val) {
        return current;
      }
      current = current.next;
    }

    return foundNode;
  }

  reverse() {
    let current = this.head,
      prev = null;

    while (current) {
      let next = current.next;

      current.next = prev;
      current.prev = next;

      prev = current;
      current = next;
    }

    this.tail = this.head;
    this.head = prev;
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

    while (current) {
      results.push(current.value);
      current = current.next;
    }

    return results;
  }

  isEmpty() {
    return this.nodeCount === 0;
  }

  size() {
    return this.nodeCount;
  }
}

module.exports = DoublyLinkedList;
