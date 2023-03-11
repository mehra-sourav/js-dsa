/**
 * Class for creating a new stack
 */
class Stack {
  /**
   * Create a new stack
   * @param {Array} items - The items to initialize the stack with
   */
  constructor(...items) {
    this.stack = [];

    items.forEach((item) => {
      this.stack.push(item);
    });
  }

  /**
   * Adds a new item to the top of the stack
   * !Time Complexity: O(n)
   * !Space Complexity: O(1)
   * @param {number} item The new item to be added
   */
  push(item) {
    this.stack.push(item);
  }

  /**
   * Removes the item at the top of the stack and returns it
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @return {number} The item at the top of the stack
   */
  pop() {
    return this.stack.pop();
  }

  /**
   * Returns the item at the top of the stack
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @return {number} The item at the top of the stack
   */
  peek() {
    return this.stack.at(-1);
  }

  /**
   * Returns the size of the stack
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @return {number} The size of the stack
   */
  length() {
    return this.stack.length;
  }

  /**
   * Prints all the items in the stack
   * !Time Complexity: O(n)
   * !Space Complexity: O(1)
   */
  print() {
    let length = this.stack.length;
    for (let i = length - 1; i >= 0; i--) {
      console.log(`${this.stack[i]} `);
    }
  }

  /**
   * Searches for a specific item in the stack
   * !Time Complexity: O(n)
   * !Space Complexity: O(1)
   * @param {number} item The items that needs to be searched in the stack
   * @return {number} The index where the item is found in the stack
   */
  search(item) {
    // let length = this.stack.length;
    for (let i = 0; i < this.length(); i++) {
      if (this.stack[i] == item) {
        return i;
      }
    }
    return -1;
  }
}

const stack = new Stack(1, 2, 3, 4, 5);

stack.print();
console.log("Length of stack:", stack.length());
stack.push(21);
stack.push(53);

console.log("\n");
stack.print();

console.log("Length of stack before popping:", stack.length());
console.log("Popped item:", stack.pop());
console.log("Length of stack after popping:", stack.length());

console.log("\n");
stack.print();

console.log("\nItem at top of stack:", stack.peek());
console.log("Length of stack:", stack.length());

console.log("\n4 is present in stack at index:", stack.search(4));
console.log("24 is present in stack at index:", stack.search(24));
