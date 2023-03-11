/**
 * Class for creating a new queue
 */
class Queue {
  /**
   * Create a new queue
   * @param {Array} items - The items to initialize the queue with
   */
  constructor(...items) {
    this.queue = [];

    items.forEach((item) => {
      this.queue.push(item);
    });
  }

  /**
   * Adds a new item to the back of the queue
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @param {number} item The new item to be added
   */
  push(item) {
    this.queue.push(item);
  }

  /**
   * Removes the item at the front of the queue and returns it
   * !Time Complexity: O(n)
   * !Space Complexity: O(1)
   * @return {number} The item at the front of the queue
   */
  pop() {
    return this.queue.shift();
  }

  /**
   * Returns the item at the front of the queue
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @return {number} The item at the front of the queue
   */
  front() {
    return this.queue[0];
  }

  /**
   * Returns the item at the end of the queue
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @return {number} The item at the end of the queue
   */
  rear() {
    return this.queue[this.length() - 1];
  }

  /**
   * Returns the length of the queue
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @return {number} The length of the queue
   */
  length() {
    return this.queue.length;
  }

  /**
   * Prints all the items in the queue
   * !Time Complexity: O(n)
   * !Space Complexity: O(1)
   */
  print() {
    console.log(this.queue.join(" "));
  }

  /**
   * Searches for a specific item in the queue
   * !Time Complexity: O(n)
   * !Space Complexity: O(1)
   * @param {number} item The items that needs to be searched in the queue
   * @return {number} The index where the item is found in the queue
   */
  search(item) {
    for (let i = 0; i < this.length(); i++) {
      if (this.queue[i] == item) {
        return i;
      }
    }
    return -1;
  }
}

const queue = new Queue(1, 2, 3, 4, 5);

queue.print();
console.log("Length of queue:", queue.length());
queue.push(21);
queue.push(53);

console.log("\n");
queue.print();

console.log("Length of stack queue popping:", queue.length());
console.log("Popped item:", queue.pop());
console.log("Length of queue after popping:", queue.length());
queue.print();

console.log("\nItem at front of queue:", queue.front());
console.log("Item at back of queue:", queue.rear());

console.log("\n4 is present in stack at index:", queue.search(4));
console.log("24 is present in stack at index:", queue.search(24));
