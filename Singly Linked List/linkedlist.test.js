const LinkedList = require("./index");

describe("Initialization", () => {
    it("should initialize an empty linked list", () => {
        const linkedList = new LinkedList();
        expect(linkedList.size()).toEqual(0);
        expect(linkedList.getHead()).toEqual(null);
    });

    it('should initialize linked list with provided values', () => {
        const linkedList = new LinkedList(1, 2, 3);
        expect(linkedList.size()).toEqual(3);
        expect(linkedList.toArray()).toEqual([1, 2, 3]);
    })
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
        expect(linkedList.size()).toEqual(2);
        expect(linkedList.toArray()).toEqual([2, 1]);
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
    });

    it("should remove a node at the tail", () => {
        const linkedList = new LinkedList(1, 2, 3);
        expect(linkedList.size()).toEqual(3);
        expect(linkedList.removeTail()).toEqual(3);
        expect(linkedList.getTail().value).toEqual(2);
        expect(linkedList.size()).toEqual(2);
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

            expect(linkedList.removeByValue(2)).toEqual(2);
            expect(linkedList.size()).toEqual(1);
            expect(linkedList.toArray()).toEqual([3]);
        });

        it("should remove the tail node if it matches the value", () => {
            const linkedList = new LinkedList(1, 2, 3);
            expect(linkedList.size()).toEqual(3);

            expect(linkedList.removeByValue(3)).toEqual(3);
            expect(linkedList.size()).toEqual(2);
            expect(linkedList.toArray()).toEqual([1, 2]);

            expect(linkedList.removeByValue(2)).toEqual(2);
            expect(linkedList.size()).toEqual(1);
            expect(linkedList.toArray()).toEqual([1]);
            expect(linkedList.getHead().value).toEqual(1);
            expect(linkedList.getTail().value).toEqual(1);
        });

        it("should remove a middle node", () => {
            const linkedList = new LinkedList(1, 2, 3, 4);
            expect(linkedList.size()).toEqual(4);

            expect(linkedList.removeByValue(3)).toEqual(3);
            expect(linkedList.size()).toEqual(3);
            expect(linkedList.toArray()).toEqual([1, 2, 4]);
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

        it('should update head and tail to null when removing the only node from a single-node linked list', () => {
            const linkedList = new LinkedList(1);
            expect(linkedList.removeByValue(1)).toEqual(1);
            expect(linkedList.size()).toEqual(0);
            expect(linkedList.getHead()).toEqual(null);
            expect(linkedList.getTail()).toEqual(null);
        })
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

    it("should convert the list to an array", () => {
        const linkedList = new LinkedList(1, 2, 3);
        expect(linkedList.toArray()).toEqual([1, 2, 3]);
    });
});