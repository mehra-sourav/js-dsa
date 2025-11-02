/**
 * Class for creating a new graph
 */
class AdjacencyListGraph {
  constructor(...items) {
    this.adjacencyList = {};
    this.isDirectedGraph = items[0] ?? false;

    items?.slice(1)?.forEach((item) => this.addVertex(item));
  }

  /**
   * Inserts a new vertex to the graph
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @param {number} value - The value of the new vertex to insert.
   * @returns {number|false} The vertex value if added; otherwise, false if already present.
   */
  addVertex(value) {
    if (this.hasVertex(value)) {
      return false;
    }

    this.adjacencyList[value] = new Map();

    return value;
  }

  /**
   * Removes a vertex from the graph
   * !Time Complexity: O(V)
   * !Space Complexity: O(1)
   * @param {number} value - The vertex to remove.
   * @returns {number|false} The vertex if removed; false if it does not exist.
   */
  removeVertex(value) {
    if (!this.hasVertex(value)) {
      return false;
    }

    let neighbourNodes = this.adjacencyList[value];

    // Removing the node from it's neighbours' adjacency lists
    neighbourNodes?.forEach((_, node) => this.removeEdge(node, value));

    delete this.adjacencyList[value];

    return value;
  }

  /**
   * Adds an edge between the two provided vertices
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @param {number} source - The value of the vertex where the edge
   * starts from
   * @param {number} destination - The value of the vertex where the edge
   * ends
   * @returns {Array|false} Edge endpoints if added; false if edge already exists.
   */
  addEdge(source, destination, weight = 1) {
    // Adding missing vertices
    if (!this.hasVertex(source)) {
      this.addVertex(source);
    }

    if (!this.hasVertex(destination)) {
      this.addVertex(destination);
    }

    // Early return if edge already exists
    if (this.hasEdge(source, destination)) {
      return false;
    }

    this.adjacencyList[source].set(destination, weight);

    if (!this.isDirected()) {
      this.adjacencyList[destination].set(source, weight);
    }

    return [source, destination];
  }

  /**
   * Removes the edge(s) between the two provided vertices
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @param {number} source - The value of the vertex where the edge
   * starts from
   * @param {number} destination - The value of the vertex where the edge
   * ends
   * @returns {Array|false} Edge endpoints if removed; false if edge did not exist.
   */
  removeEdge(source, destination) {
    if (
      !this.hasVertex(source) ||
      !this.hasVertex(destination) ||
      !this.hasEdge(source, destination)
    ) {
      return false;
    }

    this.adjacencyList[source].delete(destination);

    if (!this.isDirected()) {
      this.adjacencyList[destination].delete(source);
    }

    return [source, destination];
  }

  // /**
  //  * Traverses the graph using breadth first search algorithm
  //  * !Time Complexity: O(n)
  //  * !Space Complexity: O(1)
  //  */
  // bfsTraversal() {
  //   let startNode = Object.keys(this.adjacencyList)[0];
  //   let queue = [startNode];
  //   let visitedNodes = new Set();

  //   while (queue.length) {
  //     // Popping out an item from queue
  //     let currentNode = queue.shift();

  //     let currentNodeKey = currentNode.toString();
  //     if (visitedNodes.has(currentNodeKey)) continue;

  //     process.stdout.write(`${currentNode} `);

  //     // Extracting the neighbours of the current node
  //     let currentNodeNeighbours = this.adjacencyList[currentNode];
  //     currentNodeNeighbours?.forEach((node) => {
  //       let key = node.toString();

  //       // Adding the neighbour node to the queue only if it's not visited
  //       if (!visitedNodes.has(key)) {
  //         queue.push(node);
  //       }
  //     });

  //     // Marking the current node as visited;
  //     visitedNodes.add(currentNodeKey);
  //   }
  // }

  // /**
  //  * Traverses the graph using depth first search algorithm
  //  * !Time Complexity: O(n)
  //  * !Space Complexity: O(1)
  //  */
  // dfsTraversal() {
  //   let startNode = Object.keys(this.adjacencyList)[0];
  //   let stack = [startNode];
  //   let visitedNodes = new Set();

  //   while (stack.length) {
  //     // Popping out an item from stack
  //     let currentNode = stack.pop();
  //     let currentNodeKey = currentNode.toString();

  //     if (visitedNodes.has(currentNodeKey)) continue;

  //     process.stdout.write(`${currentNode} `);

  //     // Extracting the neighbours of the current node
  //     let currentNodeNeighbours = this.adjacencyList[currentNode];
  //     currentNodeNeighbours?.forEach((node) => {
  //       let key = node.toString();

  //       // Adding the neighbour node to the stack only if it's not visited
  //       if (!visitedNodes.has(key)) {
  //         stack.push(key);
  //       }
  //     });

  //     // Marking the current node as visited;
  //     visitedNodes.add(currentNodeKey);
  //   }
  // }

  /**
   * Returns the number of nodes in the graph
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @returns {number} The number of nodes in the graph
   */
  size() {
    return Object.keys(this.adjacencyList).length;
  }

  /**
   * Returns a list of nodes in the graph
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @returns {string[]} Array of vertex keys as strings
   */
  getVertices() {
    return Object.keys(this.adjacencyList);
  }

  /**
   * Checks if the graph has a certain vertex
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @param {number} node - The value of the vertex whose presence needs to be checked
   * @returns {boolean}
   */
  hasVertex(node) {
    return this.adjacencyList.hasOwnProperty(node);
  }

  /**
   * Checks if an edge exists from source vertex to destination vertex
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @param {number} source - The starting vertex of the edge
   * @param {number} destination - The ending vertex of the edge
   * @returns {boolean} True if the edge exists, false otherwise
   */
  hasEdge(source, destination) {
    if (!this.hasVertex(source) || !this.hasVertex(destination)) {
      return false;
    }

    return this.adjacencyList[source].has(destination);
  }

  /**
   * Returns the set containing the neighbours of a vertex
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @param {number} value - The value of the vertex whose neighbours needs to be returned
   * @returns {Set}  Set of neighbors
   */
  getNeighbours(value) {
    return new Set(this.adjacencyList[value].keys());
  }

  /**
   * Returns if the graph is directed or not
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @returns {boolean}
   */
  isDirected() {
    return this.isDirectedGraph;
  }
}

module.exports = AdjacencyListGraph;
