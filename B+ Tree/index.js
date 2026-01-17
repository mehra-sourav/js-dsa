class Node {
    constructor(order, parent = null, next = null) {
        this.order = order;
        this.keys = new Array(order - 1).fill(null);
        this.children = new Array(order).fill(null);
        this.keyCount = 0;
        this.parent = parent;
        this.next = next;
    }
}