/**
 * Class for creating a new graph
 */
class Graph {
  constructor(...items) {
    this.adjacencyList = {};
    this.isDirectedGraph = items[0] ?? false;

    items?.slice(1)?.forEach((item) => this.addVertex(item));
  }

  /**
   * Inserts a new vertex to the graph
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @param {number} value - The value of the new vertex that will be inserted
   */
  addVertex(value) {
    // Adding vertex to the graph if it doesn't already exist
    if (!this.doesVertexExist(value)) {
      this.adjacencyList[value] = [];
    }
  }

  /**
   * Removes a vertex from the graph
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @param {number} value - The value of the vertex that will be removed
   */
  removeVertex(value) {
    let neighbourNodes = this.adjacencyList[value];

    // Removing the node from it's neighbours' adjacency lists
    neighbourNodes?.forEach((node) => this.removeEdge(value, node));

    // Deleting the node
    delete this.adjacencyList[value];
  }

  /**
   * Adds an edge between the two provided vertices
   * !Time Complexity: O(n)
   * !Space Complexity: O(1)
   * @param {number} sourceVertex - The value of the vertex where the edge
   * starts from
   * @param {number} destVertex - The value of the vertex where the edge
   * ends
   */
  addEdge(sourceVertex, destVertex) {
    // Adding sourceVertex if it doesn't exist
    if (!this.doesVertexExist(sourceVertex)) {
      this.addVertex(sourceVertex);
    }
    // Adding destVertex if it doesn't exist
    if (!this.doesVertexExist(destVertex)) {
      this.addVertex(destVertex);
    }

    // Adding an edge between the two
    this.adjacencyList[sourceVertex] = [
      ...new Set([...this.adjacencyList[sourceVertex], destVertex]),
    ];

    // Adding edge from destination to source if the graph is undirected
    if (!this.isDirectedGraph) {
      this.adjacencyList[destVertex] = [
        ...new Set([...this.adjacencyList[destVertex], sourceVertex]),
      ];
    }
  }

  /**
   * Removes the edge(s) between the two provided vertices
   * !Time Complexity: O(??) n?
   * !Space Complexity: O(1)
   * @param {number} sourceVertex - The value of the vertex where the edge
   * starts from
   * @param {number} destVertex - The value of the vertex where the edge
   * ends
   */
  removeEdge(sourceVertex, destVertex) {
    // Filtering out the destination vertex from the adjacency list of the
    // source vertex
    this.adjacencyList[sourceVertex] = this.adjacencyList[sourceVertex].filter(
      (v) => v != destVertex
    );

    // Filtering out the source vertex from the adjacency list of the
    // destination vertex if the graph is undirected
    if (!this.isDirectedGraph) {
      this.adjacencyList[destVertex] = this.adjacencyList[destVertex].filter(
        (v) => v != sourceVertex
      );
    }
  }

  /**
   * Traverses the graph using breadth first search algorithm
   * !Time Complexity: O(n)
   * !Space Complexity: O(1)
   */
  bfsTraversal() {
    let startNode = Object.keys(this.adjacencyList)[0];
    let queue = [startNode];
    let visitedNodes = new Set();

    while (queue.length) {
      // Popping out an item from queue
      let currentNode = queue.shift();
      // console.log(currentNode);
      process.stdout.write(`${currentNode} `);

      // Extracting the neighbours of the current node
      let currentNodeNeighbours = this.adjacencyList[currentNode];
      currentNodeNeighbours?.forEach((node) => {
        let key = node.toString();

        // Adding the neighbour node to the queue only if it's not visited
        if (!visitedNodes.has(key)) {
          queue.push(node);
        }
      });

      let key = currentNode.toString();

      // Marking the current node as visited;
      visitedNodes.add(key);
    }
  }

  /**
   * Traverses the graph using depth first search algorithm
   * !Time Complexity: O(n)
   * !Space Complexity: O(1)
   */
  dfsTraversal() {
    let startNode = Object.keys(this.adjacencyList)[0];
    let stack = [startNode];
    let visitedNodes = new Set();

    while (stack.length) {
      // Popping out an item from stack
      let currentNode = stack.pop();

      process.stdout.write(`${currentNode} `);

      // Extracting the neighbours of the current node
      let currentNodeNeighbours = this.adjacencyList[currentNode];
      currentNodeNeighbours?.forEach((node) => {
        let key = node.toString();

        // Adding the neighbour node to the stack only if it's not visited
        if (!visitedNodes.has(key)) {
          stack.push(key);
        }
      });

      let key = currentNode.toString();

      // Marking the current node as visited;
      visitedNodes.add(key);
    }
  }

  /**
   * Checks if a particular vertex exists in the graph
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @param {number} value - The value of the vertex whose presence needs to be
   * checked
   * @returns {number} If the vertex exists in the graph or not
   */
  doesVertexExist(value) {
    return Object.keys(this.adjacencyList).includes(value.toString());
  }

  /**
   * Returns the number of nodes in the graph
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @returns {number} The number of nodes in the graph
   */
  size() {
    return Object.keys(this.adjacencyList).length;
  }
}

const graph = new Graph(false, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

graph.addEdge(1, 2);
graph.addEdge(1, 3);
graph.addEdge(1, 4);
graph.addEdge(2, 5);
graph.addEdge(3, 6);
graph.addEdge(3, 7);
graph.addEdge(4, 8);
graph.addEdge(5, 9);
graph.addEdge(6, 10);

console.log("BFS Traversal:");
graph.bfsTraversal();
console.log("\n\nDFS Traversal:");
graph.dfsTraversal();
