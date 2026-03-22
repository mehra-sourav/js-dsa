class Node {
  constructor(value, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
    this.parent = null;
  }
}

class TreeHeap {
  constructor(...items) {
    this.heap = null;
    this.heapSize = 0;

    this.maxHeap = !!items[0] ?? false;

    items?.slice(1)?.forEach((item) => {
      if (typeof item === "number" && !Number.isNaN(item)) {
        this.insert(item);
      }
    });
  }

  insert(value) {
    const insertNodeHelper = (val) => {
      const newNode = new Node(val);
      if (this.heap === null) {
        this.heap = newNode;
      } else {
        // Doing a level order traversal to find suitable place for the node
        const queue = [this.heap];

        while (queue.length > 0) {
          const currentNode = queue.shift();

          if (currentNode.left === null) {
            newNode.parent = currentNode;
            currentNode.left = newNode;
            break;
          } else if (currentNode.right === null) {
            newNode.parent = currentNode;
            currentNode.right = newNode;
            break;
          } else {
            queue.push(currentNode.left, currentNode.right);
          }
        }
      }
      return newNode;
    };
    const newNode = insertNodeHelper(value);
    this.heapSize++;
    this.#heapifyUp(newNode);
  }

  extract() {
    if (this.size() === 0) return null;
    if (this.size() === 1) {
      const extractedValue = this.heap.value;
      this.heap = null;
      this.heapSize--;
      return extractedValue;
    }

    const rootNode = this.heap;
    let lastNode = this.#getLastNode();

    const extractedValue = rootNode.value;

    // Swapping items at root and last node
    if (rootNode && lastNode) {
      this.#swap(rootNode, lastNode);
    }

    // Deleting the root element which is now at end by finding it's parent
    if (lastNode.parent?.left === lastNode) {
      lastNode.parent.left = null;
    } else if (lastNode.parent?.right === lastNode) {
      lastNode.parent.right = null;
    }

    this.heapSize--;
    this.#heapifyDown(rootNode);

    return extractedValue;
  }

  clear() {
    this.heap = null;
    this.heapSize = 0;
  }

  #heapifyUp(node) {
    if (node === null) return;
    let tempNode = node;

    // Checking if a parent should be swapped with child
    while (
      this.#hasParent(tempNode) &&
      !this.#compare(tempNode.parent, tempNode)
    ) {
      this.#swap(tempNode.parent, tempNode);
      tempNode = tempNode.parent;
    }
  }

  #hasParent(node) {
    return node.parent !== null;
  }

  #swap(parentNode, childNode) {
    [parentNode.value, childNode.value] = [childNode.value, parentNode.value];
  }

  #heapifyDown(node) {
    if (node === null) return;

    let tempNode = node;

    while (this.#hasLeftChild(tempNode)) {
      // Assume the left child is the best replacement candidate till now

      let replacementNode = tempNode.left;

      // If right child exists, see if it is a better replacement than left
      if (
        this.#hasRightChild(tempNode) &&
        !this.#compare(replacementNode, tempNode.right)
      ) {
        replacementNode = tempNode.right;
      }

      // Only replace if the candidate is better suited than the parent
      if (this.#compare(tempNode, replacementNode)) {
        break;
      }

      this.#swap(tempNode, replacementNode);
      tempNode = replacementNode;
    }
  }

  #hasLeftChild(node) {
    return node.left !== null;
  }

  #hasRightChild(node) {
    return node.right !== null;
  }

  #compare(parentNode, childNode) {
    if (this.maxHeap) {
      return parentNode.value > childNode.value;
    } else {
      return parentNode.value < childNode.value;
    }
  }

  toArray() {
    const array = [];

    const queue = [this.heap];

    while (queue.length > 0) {
      const currentNode = queue.shift();

      if (currentNode !== null) {
        array.push(currentNode.value);

        if (currentNode.left !== null) {
          queue.push(currentNode.left);
        }
        if (currentNode.right !== null) {
          queue.push(currentNode.right);
        }
      }
    }

    return array;
  }

  isMaxHeap() {
    return this.maxHeap;
  }

  size() {
    return this.heapSize;
  }

  peek() {
    return this.size() > 0 ? this.heap.value : null;
  }

  #getLastNode() {
    let lastNode = this.heap;
    const queue = [this.heap];

    while (queue.length > 0) {
      lastNode = queue.shift();

      if (lastNode.left !== null) {
        queue.push(lastNode.left);
      }
      if (lastNode.right !== null) {
        queue.push(lastNode.right);
      }
    }

    return lastNode;
  }
}

module.exports = TreeHeap;
