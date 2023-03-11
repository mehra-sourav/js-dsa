class Stack {
  /**
   * Create a new stack.
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
   * @param {number} item The new item to be added
   */
  push(item) {
    this.stack.push(item);
  }

  /**
   * Removes the item at the top of the stack and returns it
   * @return {number} The item at the top of the stack
   */
  pop() {
    return this.stack.pop();
  }

  /**
   * Returns the item at the top of the stack
   * @return {number} The item at the top of the stack
   */
  peek() {
    return this.stack.at(-1);
  }

  /**
   * Returns the size of the stack
   * @return {number} The size of the stack
   */
  length() {
    return this.stack.length;
  }

  /**
   * Prints all the items in the stack
   */
  print() {
    let length = this.stack.length;
    for (let i = length - 1; i >= 0; i--) {
      console.log(`${this.stack[i]} `);
    }
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
