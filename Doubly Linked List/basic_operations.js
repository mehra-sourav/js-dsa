/**
 * Class for creating a doubly linked list new node
 */
class Node {
  constructor(val, prev = null, next = null) {
    this.value = val;
    this.prev = prev;
    this.next = next;
  }
}

/**
 * Class for creating a new doubly linked list
 */
class DoublyLinkedList {
  /**
   * Create a new linked list
   * @param {array} items - The items to initialize the linked list with
   */
  constructor(...items) {
    this.head = null;
    this.tail = null;
    this.size = 0;

    items.forEach((item) => {
      let newNode = new Node(item);
      //   If linked list is empty
      if (this.head == null) {
        // this.head = this.tail = newNode;
        this.head = newNode;
        this.tail = this.head;
      } else {
        this.tail.next = newNode;
        newNode.prev = this.tail;
        this.tail = newNode;
      }
      this.size++;
    });
  }

  /**
   * Adds a new node to the linked list at the first position
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @param {number} val - The value of the new node that will be added
   */
  prepend(val) {
    let newNode = new Node(val);

    if (this.head == null) {
      this.head = this.tail = newNode;
    } else {
      this.head.prev = newNode;
      newNode.next = this.head;
      this.head = newNode;
    }
    this.size++;
  }

  /**
   * Adds a new node to the linked list at the last position
   * !Time Complexity: O(1) {O(1) here with tail pointer, else O(n) without tail}
   * !Space Complexity: O(1)
   * @param {number} val - The value of the new node that will be added
   */
  append(val) {
    let newNode = new Node(val);

    if (this.head == null) {
      this.head = this.tail = newNode;
      //   this.head = newNode;
      //   this.tail = this.head;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
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
    if (idx < 0 || idx > this.length()) {
      throw "Not allowed!! Index is not valid";
    }
    if (idx == 0) {
      this.prepend(val);
    } else if (idx == this.length() - 1) {
      this.append(val);
    } else {
      //   let newNode = new Node(val);
      let temp = this.head;

      for (let i = 0; i < idx - 1; i++) {
        temp = temp.next;
      }

      let newNode = new Node(val, temp, temp.next);

      // Attaching node at idx to new node
      newNode.next.prev = newNode;

      // Attaching node at idx - 1 to new node
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
    if (idx < 0 || idx >= this.length()) {
      throw "Not allowed!! Index is not valid";
    } else if (idx == 0) {
      // If linked list is not empty
      if (this.head != null) {
        this.head = this.head.next;

        // If any node still exists in the list
        if (this.head) {
          this.head.prev = null;
        }
      }
    } else if (idx == this.length() - 1) {
      this.tail = this.tail.prev;
      this.tail.next = null;
    } else {
      let temp = this.head;

      for (let i = 0; i < idx - 1; i++) {
        temp = temp.next;
      }

      temp.next = temp.next.next;
      temp.next.prev = temp;
    }

    this.size--;
  }

  /**
   * Searches for a node with a specified value in the linked list
   * !Time Complexity: O(n)
   * !Space Complexity: O(1)
   * @param {number} val The value of the new node that needs to be searched for
   * @returns {number} The index of the linked list where the node with the
   * value is present
   */
  search(val) {
    let start = 0,
      end = this.length() - 1,
      tempStart = this.head,
      tempEnd = this.tail;

    while (start <= end) {
      if (tempStart.value == val) {
        return start;
      }

      if (tempEnd.value == val) {
        return end;
      }

      start++;
      end--;
      tempStart = tempStart.next;
      tempEnd = tempEnd.prev;
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

    this.tail = curr;

    while (curr) {
      let next = curr.next;
      curr.next = prev;
      curr.prev = next;

      prev = curr;
      curr = next;
    }
    this.head = prev;
  }

  //   1 2 3 4 5

  /**
   * Prints all the items in the linked list
   * !Time Complexity: O(n)
   * !Space Complexity: O(1)
   */
  print() {
    let temp = this.head,
      res = [];

    if (this.length() == 0) {
      console.log("List: ", null);
    } else {
      while (temp) {
        res.push(temp.value);
        temp = temp.next;
      }
      console.log("List: ", res.join(" <=> "));
    }
  }

  /**
   * Returns the length of the linked list
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   */
  length() {
    return this.size;
  }
}

const list = new DoublyLinkedList(1, 2, 3, 4, 5);

list.print();
console.log("Length of list:", list.length());

console.log("\nPrepending 53");
list.prepend(53);
console.log("Appending 21");
list.append(21);

console.log("\n");
list.print();
console.log("Length of list:", list.length());

console.log("\nPushing 12 at index 0");
list.pushAt(0, 12);
console.log("Pushing 57 at index len - 1");
list.pushAt(list.length() - 1, 57);
console.log("Pushing 987 at index 3");
list.pushAt(3, 987);

console.log("\n");
list.print();
console.log("Length of list:", list.length());

console.log("\nRemoving node at index 0");
list.removeAt(0);
console.log("Removing node at index len - 1");
list.removeAt(list.length() - 1);
console.log("Removing node at index 3");
list.removeAt(3);

console.log("\n");
list.print();
console.log("Length of list:", list.length());

console.log("\nIndex of 3.4 in the list:", list.search(3.4));
console.log("Index of 987 in the list:", list.search(987));
console.log("Index of 21 in the list:", list.search(21));

console.log("\nReversing the list");
list.reverse();
list.print();
console.log("Length of list:", list.length());

console.log("Reversing the list again");
list.reverse();
list.print();
console.log("Length of list:", list.length());
