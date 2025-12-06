const LinkedList = require("./index");

describe("Initialization", () => {
  it("should initialize an empty linked list", () => {
    const linkedList = new LinkedList();
    expect(linkedList.size()).toEqual(0);
    expect(linkedList.getHead()).toEqual(null);
    expect(linkedList.getTail()).toEqual(null);
  });

  it("should initialize linked list with provided values", () => {
    const linkedList = new LinkedList(1, 2, 3);
    const head = linkedList.getHead();
    const tail = linkedList.getTail();
    expect(linkedList.size()).toEqual(3);
    expect(linkedList.toArray()).toEqual([1, 2, 3]);

    // Checking forward nodes
    expect(head.next.value).toEqual(2);
    expect(head.next.next.value).toEqual(3);
    expect(head.next.next.next).toEqual(null);

    // Checking previous nodes
    expect(tail.prev.value).toEqual(2);
    expect(tail.prev.prev.value).toEqual(1);
    expect(tail.prev.prev.prev).toEqual(null);
  });
});

describe("LinkedList Insertion", () => {
  it("should insert a node at the tail", () => {
    const linkedList = new LinkedList();
    linkedList.insertAtTail(1);
    expect(linkedList.size()).toEqual(1);
    expect(linkedList.toArray()).toEqual([1]);

    linkedList.insertAtTail(2);
    expect(linkedList.size()).toEqual(2);
    expect(linkedList.toArray()).toEqual([1, 2]);
  });

  it("should insert a node at the head", () => {
    const linkedList = new LinkedList();
    linkedList.insertAtHead(1);
    expect(linkedList.size()).toEqual(1);
    expect(linkedList.toArray()).toEqual([1]);

    linkedList.insertAtHead(2);
    const head = linkedList.getHead();
    const tail = linkedList.getTail();
    expect(linkedList.size()).toEqual(2);
    expect(linkedList.toArray()).toEqual([2, 1]);

    expect(head.prev).toEqual(null);
    expect(head.value).toEqual(2);
    expect(head.next.value).toEqual(1);

    expect(tail.next).toEqual(null);
    expect(tail.value).toEqual(1);
    expect(tail.prev.value).toEqual(2);
  });
});

describe("LinkedList Removal", () => {
  it("should return null if linked list is empty", () => {
    const linkedList = new LinkedList();
    expect(linkedList.size()).toEqual(0);
    expect(linkedList.removeHead()).toEqual(null);
    expect(linkedList.removeTail()).toEqual(null);
  });

  it("should remove a node at the head", () => {
    const linkedList = new LinkedList(1, 2, 3);
    expect(linkedList.size()).toEqual(3);
    expect(linkedList.removeHead()).toEqual(1);
    expect(linkedList.size()).toEqual(2);

    const head = linkedList.getHead();
    const tail = linkedList.getTail();

    expect(head.value).toBe(2);
    expect(head.prev).toBe(null);
    expect(head.next.value).toBe(3);

    expect(tail.value).toBe(3);
    expect(tail.next).toBe(null);
    expect(tail.prev).toBe(head);
    expect(head.next).toBe(tail);
  });

  it("should remove a node at the tail", () => {
    const linkedList = new LinkedList(1, 2, 3);
    expect(linkedList.size()).toEqual(3);
    expect(linkedList.removeTail()).toEqual(3);
    expect(linkedList.getTail().value).toEqual(2);
    expect(linkedList.size()).toEqual(2);

    const head = linkedList.getHead();
    const tail = linkedList.getTail();

    expect(head.value).toBe(1);
    expect(head.prev).toBe(null);
    expect(head.next).toBe(tail);

    expect(tail.value).toBe(2);
    expect(tail.next).toBe(null);
    expect(tail.prev).toBe(head);
  });

  it("should remove the last remaining node (head and tail is same)", () => {
    const linkedList = new LinkedList(1);
    expect(linkedList.size()).toEqual(1);

    expect(linkedList.removeHead()).toEqual(1);
    expect(linkedList.size()).toEqual(0);
    expect(linkedList.getHead()).toEqual(null);
    expect(linkedList.getTail()).toEqual(null);
  });

  it("should correctly handle removing head and tail in a two-element list", () => {
    const linkedList = new LinkedList(1, 2);

    expect(linkedList.removeHead()).toEqual(1);
    expect(linkedList.size()).toEqual(1);
    expect(linkedList.toArray()).toEqual([2]);

    expect(linkedList.removeTail()).toEqual(2);
    expect(linkedList.size()).toEqual(0);
    expect(linkedList.getHead()).toEqual(null);
    expect(linkedList.getTail()).toEqual(null);
  });

  it("should correctly handle removing the tail from a two-element list", () => {
    const linkedList = new LinkedList(1, 2);

    expect(linkedList.removeTail()).toEqual(2);
    expect(linkedList.size()).toEqual(1);
    expect(linkedList.toArray()).toEqual([1]);

    expect(linkedList.removeHead()).toEqual(1);
    expect(linkedList.size()).toEqual(0);
    expect(linkedList.getHead()).toEqual(null);
    expect(linkedList.getTail()).toEqual(null);
  });

  it("should handle the case when list becomes empty after removing head", () => {
    const linkedList = new LinkedList(1);
    expect(linkedList.removeHead()).toEqual(1);
    expect(linkedList.size()).toEqual(0);
    expect(linkedList.removeHead()).toEqual(null);
  });

  it("should handle the case when list becomes empty after removing tail", () => {
    const linkedList = new LinkedList(1);
    expect(linkedList.removeTail()).toEqual(1);
    expect(linkedList.size()).toEqual(0);
    expect(linkedList.removeTail()).toEqual(null);
  });

  it("should maintain correct backward links after mixed removals", () => {
    const linkedList = new LinkedList(1, 2, 3, 4);
    linkedList.removeHead(); // remove 1
    linkedList.removeByValue(3); // remove 3

    // List should be [2, 4]
    expect(linkedList.toArray()).toEqual([2, 4]);

    const head = linkedList.getHead();
    const tail = linkedList.getTail();

    // Forward
    expect(head.value).toBe(2);
    expect(head.next.value).toBe(4);
    expect(head.next.next).toBe(null);

    // Backward
    expect(tail.value).toBe(4);
    expect(tail.prev.value).toBe(2);
    expect(tail.prev.prev).toBe(null);
  });

  describe("LinkedList Remove by Value", () => {
    it("should return null if the list is empty", () => {
      const linkedList = new LinkedList();
      expect(linkedList.removeByValue(1)).toEqual(null);
    });

    it("should remove the head node if it matches the value", () => {
      const linkedList = new LinkedList(1, 2, 3);
      expect(linkedList.size()).toEqual(3);

      expect(linkedList.removeByValue(1)).toEqual(1);
      expect(linkedList.size()).toEqual(2);
      expect(linkedList.toArray()).toEqual([2, 3]);
      expect(linkedList.getHead().value).toEqual(2);
      expect(linkedList.getHead().prev).toEqual(null);

      expect(linkedList.removeByValue(2)).toEqual(2);
      expect(linkedList.size()).toEqual(1);
      expect(linkedList.toArray()).toEqual([3]);
      expect(linkedList.getHead().value).toEqual(3);
      expect(linkedList.getHead().prev).toEqual(null);
      expect(linkedList.getHead().next).toEqual(null);
    });

    it("should remove the tail node if it matches the value", () => {
      const linkedList = new LinkedList(1, 2, 3);
      expect(linkedList.size()).toEqual(3);

      expect(linkedList.removeByValue(3)).toEqual(3);
      expect(linkedList.size()).toEqual(2);
      expect(linkedList.toArray()).toEqual([1, 2]);
      expect(linkedList.getTail().value).toEqual(2);
      expect(linkedList.getTail().prev.value).toEqual(1);
      expect(linkedList.getTail().next).toEqual(null);

      expect(linkedList.removeByValue(2)).toEqual(2);
      expect(linkedList.size()).toEqual(1);
      expect(linkedList.toArray()).toEqual([1]);
      expect(linkedList.getHead().value).toEqual(1);
      expect(linkedList.getTail().value).toEqual(1);
      expect(linkedList.getTail().prev).toEqual(null);
      expect(linkedList.getTail().next).toEqual(null);
    });

    it("should remove a middle node", () => {
      const linkedList = new LinkedList(1, 2, 3, 4);
      expect(linkedList.size()).toEqual(4);

      expect(linkedList.removeByValue(3)).toEqual(3);
      expect(linkedList.size()).toEqual(3);
      expect(linkedList.toArray()).toEqual([1, 2, 4]);
      expect(linkedList.getTail().prev.value).toEqual(2);
      expect(linkedList.getTail().prev.next.value).toEqual(4);
    });

    it("should return null if the value does not exist in the list", () => {
      const linkedList = new LinkedList(1, 2, 3);
      expect(linkedList.removeByValue(4)).toEqual(null);
      expect(linkedList.size()).toEqual(3);
      expect(linkedList.toArray()).toEqual([1, 2, 3]);
    });

    it("should correctly handle removing all nodes until the list is empty", () => {
      const linkedList = new LinkedList(1, 2, 3);

      expect(linkedList.removeByValue(1)).toEqual(1);
      expect(linkedList.size()).toEqual(2);
      expect(linkedList.toArray()).toEqual([2, 3]);

      expect(linkedList.removeByValue(2)).toEqual(2);
      expect(linkedList.size()).toEqual(1);
      expect(linkedList.toArray()).toEqual([3]);

      expect(linkedList.removeByValue(3)).toEqual(3);
      expect(linkedList.size()).toEqual(0);
      expect(linkedList.toArray()).toEqual([]);
    });

    it("should update head and tail to null when removing the only node from a single-node linked list", () => {
      const linkedList = new LinkedList(1);
      expect(linkedList.removeByValue(1)).toEqual(1);
      expect(linkedList.size()).toEqual(0);
      expect(linkedList.getHead()).toEqual(null);
      expect(linkedList.getTail()).toEqual(null);
    });
  });
});

describe("LinkedList Find", () => {
  it("should find a node in a non-empty list", () => {
    const linkedList = new LinkedList(1, 2, 3);
    const node = linkedList.find(2);
    expect(node).not.toEqual(null);
    expect(node.value).toEqual(2);
  });

  it("should return null if the node is not found in the list", () => {
    const linkedList = new LinkedList(1, 2, 3);
    const node = linkedList.find(4);
    expect(node).toEqual(null);
  });

  it("should find the node in a list with a single node", () => {
    const linkedList = new LinkedList(1);
    const node = linkedList.find(1);
    expect(node).not.toEqual(null);
    expect(node.value).toEqual(1);
  });

  it("should find the head node", () => {
    const linkedList = new LinkedList(1, 2, 3);
    const node = linkedList.find(1);
    expect(node).not.toEqual(null);
    expect(node.value).toEqual(1);
  });

  it("should find the tail node", () => {
    const linkedList = new LinkedList(1, 2, 3);
    const node = linkedList.find(3);
    expect(node).not.toEqual(null);
    expect(node.value).toEqual(3);
  });
});

describe("Reverse Linked list", () => {
  it("should be able to reverse a linked list with one element correctly", () => {
    const linkedList = new LinkedList(1);

    expect(linkedList.toArray()).toEqual([1]);

    linkedList.reverse();

    expect(linkedList.toArray()).toEqual([1]);
    expect(linkedList.getHead().value).toEqual(1);
    expect(linkedList.getHead().prev).toEqual(null);
    expect(linkedList.getHead().next).toEqual(null);
  });

  it("should be able to reverse a linked list with two elements correctly", () => {
    const linkedList = new LinkedList(1, 2);

    expect(linkedList.toArray()).toEqual([1, 2]);

    linkedList.reverse();

    expect(linkedList.toArray()).toEqual([2, 1]);
    expect(linkedList.getHead().value).toEqual(2);
    expect(linkedList.getHead().prev).toEqual(null);
    expect(linkedList.getHead().next.value).toEqual(1);

    expect(linkedList.getTail().value).toEqual(1);
    expect(linkedList.getTail().prev.value).toEqual(2);
    expect(linkedList.getTail().next).toEqual(null);
  });

  it("should be able to reverse a linked list with no elements correctly", () => {
    const linkedList = new LinkedList();

    expect(linkedList.toArray()).toEqual([]);

    linkedList.reverse();

    expect(linkedList.toArray()).toEqual([]);
    expect(linkedList.getHead()).toEqual(null);
    expect(linkedList.getTail()).toEqual(null);
  });

  it("should be able to reverse a linked list with multiple elements correctly", () => {
    const linkedList = new LinkedList(1, 2, 3, 4, 5);

    expect(linkedList.toArray()).toEqual([1, 2, 3, 4, 5]);

    linkedList.reverse();

    expect(linkedList.toArray()).toEqual([5, 4, 3, 2, 1]);
    expect(linkedList.getHead().value).toEqual(5);
    expect(linkedList.getHead().prev).toEqual(null);
    expect(linkedList.getHead().next.value).toEqual(4);

    expect(linkedList.getTail().value).toEqual(1);
    expect(linkedList.getTail().prev.value).toEqual(2);
    expect(linkedList.getTail().next).toEqual(null);
  });

  it("should correctly update the head and tail after reversing the list", () => {
    const linkedList = new LinkedList(1, 2, 3);

    expect(linkedList.getHead().value).toEqual(1);
    expect(linkedList.getTail().value).toEqual(3);

    linkedList.reverse();

    expect(linkedList.getHead().value).toEqual(3);
    expect(linkedList.getTail().value).toEqual(1);
  });
});

describe("LinkedList Utility Methods", () => {
  it("should return correct size", () => {
    const linkedList = new LinkedList(1, 2, 3);
    expect(linkedList.size()).toEqual(3);
  });

  it("should correctly check if the list is empty", () => {
    const emptyList = new LinkedList();
    expect(emptyList.isEmpty()).toEqual(true);

    const linkedList = new LinkedList(1);
    expect(linkedList.isEmpty()).toEqual(false);
  });

  it("should return the correct head of the list", () => {
    const linkedList = new LinkedList(1, 2, 3);
    expect(linkedList.getHead().value).toEqual(1);
  });

  it("should return correct tail", () => {
    const linkedList = new LinkedList(1, 2, 3);
    expect(linkedList.getTail().value).toEqual(3);
  });

  it("should convert the list to an array", () => {
    const linkedList = new LinkedList(1, 2, 3);
    expect(linkedList.toArray()).toEqual([1, 2, 3]);
  });
});
