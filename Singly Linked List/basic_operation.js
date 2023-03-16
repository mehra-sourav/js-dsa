/**
 * Class for creating a new node
 */
class Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

/**
 * Class for creating a new singly linked list
 */
class SinglyLinkedList {
  /**
   * Create a new linked list
   * @param {Array} items - The items to initialize the linked list with
   */
  constructor(...items) {
    this.head = null;
    this.tail = null;
    this.size = 0;

    items.forEach((item) => {
      let newNode = new Node(item, null);

      // If linked list is empty
      if (!this.head) {
        this.head = newNode;
        this.tail = this.head;
      } else {
        let lastNode = this.tail;
        if (lastNode == null) {
          this.head = newNode;
          this.tail = this.head;
        } else {
          lastNode.next = newNode;
          this.tail = newNode;
        }
      }

      this.size++;
    });
  }

  /**
   * Adds a new node to the linked list at the first position
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @param {number} val The value of the new that will be added
   */
  prepend(val) {
    const newNode = new Node(val);

    // If linked list is empty
    if (!this.head) {
      this.head = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
    this.size++;
  }

  /**
   * Adds a new node to the linked list at the last position
   * !Time Complexity: O(1) {O(1) here with tail pointer, else O(n) without tail}
   * !Space Complexity: O(1)
   * @param {number} val The value of the new that will be added
   */
  append(val) {
    const newNode = new Node(val);

    // If linked list is empty
    if (!this.head) {
      this.head = newNode;
      this.tail = this.head;
    } else {
      // Attaching the new node to the last node in the linked list
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.size++;
  }

  /**
   * Adds a new node to the linked list at the specified index
   * !Time Complexity: O(k) where k is the index
   * !Space Complexity: O(1)
   * @param {number} idx The index at which the new node will be added
   * @param {number} val The value of the new node that will be added
   */
  pushAt(idx, val) {
    if (idx < 0 || idx > this.size) {
      throw "Not allowed!! Index is not valid";
    } else if (idx == 0) {
      this.prepend(val);
    } else if (idx == this.length() - 1) {
      this.append(val);
    } else {
      let temp = this.head;
      const newNode = new Node(val);

      for (let i = 0; i < idx - 1; i++) {
        temp = temp.next;
      }
      newNode.next = temp.next;
      temp.next = newNode;
      this.size++;
    }
  }

  /**
   * Removes a node from the specified index of the linked list
   * !Time Complexity: O(k) where k is the index
   * !Space Complexity: O(1)
   * @param {number} idx The index from which the node will be removed
   */
  removeAt(idx) {
    if (idx < 0 || idx > this.length() - 1) {
      throw "Not allowed!! Index is not valid";
    } else if (idx == 0) {
      // If linked list is not empty
      if (this.head != null) {
        this.head = this.head.next;
      }
    } else if (idx == this.length() - 1) {
      let temp = this.head;

      // Iterating to the penultimate node
      for (let i = 0; i < idx - 1 - 1; i++) {
        temp = temp.next;
      }

      temp.next = null;
      this.tail = temp;
    } else {
      let temp = this.head;
      for (let i = 0; i < idx - 1; i++) {
        temp = temp.next;
      }
      temp.next = temp.next.next;
    }
    this.size--;
  }

  /**
   * Searches for a node with a specified value in the linked list
   * !Time Complexity: O(n)
   * !Space Complexity: O(1)
   * @param {number} val The value of the new node that needs to be searched
   * @returns {number} The index of the linked list where the node with the
   * value is present
   */
  search(val) {
    let temp = this.head,
      idx = 0;
    while (temp) {
      if (temp.value == val) {
        return idx;
      }
      temp = temp.next;
      idx++;
    }
    return -1;
  }

  /**
   * Reverse the linked list
   * !Time Complexity: O(n)
   * !Space Complexity: O(1)
   */
  reverse() {
    let prev = null,
      curr = this.head;

    while (curr) {
      let next = curr.next;
      curr.next = prev;
      prev = curr;
      curr = next;
    }
    this.head = prev;
  }

  /**
   * Returns the length of the linked list
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   */
  length() {
    return this.size;
  }

  /**
   * Prints all the items in the linked list
   * !Time Complexity: O(n)
   * !Space Complexity: O(1)
   */
  print() {
    let res = [];
    let temp = this.head;

    if (this.length() == 0) {
      console.log("List: ", null);
    } else {
      while (temp) {
        res.push(temp.value);
        temp = temp.next;
      }
      console.log("List: ", res.join(" --> "));
    }
  }
}

const list = new SinglyLinkedList(1, 2, 3, 4, 5);

list.print();
console.log("Length of queue:", list.length());
list.append(21);
list.prepend(53);
list.pushAt(2, 1.5);

list.print();
console.log("Length of queue:", list.length());

list.removeAt(0);

list.print();
console.log("Length of queue:", list.length());

console.log("Index of 3.4 in the list:", list.search(3.4));
console.log("Index of 1 in the list:", list.search(1));

list.print();
console.log("Length of queue:", list.length());

console.log("Reversing the list");
list.reverse();
list.print();
console.log("Length of queue:", list.length());

console.log("Reversing the list again");
list.reverse();
list.print();
console.log("Length of queue:", list.length());
