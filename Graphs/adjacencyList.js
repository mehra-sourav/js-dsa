const { MinHeap } = require("@datastructures-js/heap");

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
   * @param {number} weight - The value of the weight of the edge
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

    return [source, destination, weight];
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

  /**
   * Finds the shortest path from the start vertex to all other vertices using Dijkstra's algorithm.
   * !Time Complexity: O(ElogV)
   * !Space Complexity: O(V + E)
   * @param {number} source - The starting vertex.
   *  @returns {Object} An object with two properties:
   *   - distances: An object mapping each vertex (number) to its shortest distance (number) from the source.
   *   - path: An object mapping each vertex (number) to a string representing the shortest path from the source.
   *     The path string format is like "1 --> 2 --> 5".
   */
  dijkstra(source) {
    if (!this.hasVertex(source)) return { distances: {}, path: {} };

    const vertices = this.getVertices();
    const visited = new Set();
    const distances = new Map();
    const path = new Map();
    const minHeap = new MinHeap((a) => a[1]);

    // Intializing distances for each vertex with Infinity
    vertices.forEach((vertex) => {
      distances.set(Number(vertex), Infinity);
      path.set(Number(vertex), "");
    });

    // Marking source's distance from itself to 0
    distances.set(source, 0);
    path.set(source, String(source));
    minHeap.insert([source, 0, String(source)]);

    while (minHeap.size() > 0) {
      const [currentNode, distanceTillCurrent, pathSoFar] =
        minHeap.extractRoot();

      visited.add(currentNode);

      const neighbours = this.getNeighbours(currentNode);

      // Updating distances of all unvisited neighbours of current node
      for (const vertex of neighbours) {
        if (visited.has(vertex)) continue;

        const dist = this.getEdge(currentNode, vertex);

        if (distanceTillCurrent + dist < distances.get(vertex)) {
          distances.set(vertex, distanceTillCurrent + dist);
          path.set(vertex, pathSoFar + ` --> ${vertex}`);
          minHeap.insert([vertex, distances.get(vertex), path.get(vertex)]);
        }
      }
    }

    return {
      distances: Object.fromEntries(distances),
      path: Object.fromEntries(path),
    };
  }

  /**
   * Traverses the graph using breadth first search algorithm
   * !Time Complexity: O(n)
   * !Space Complexity: O(1)
   * @param {number} [start] - The starting vertex.
   * @returns {number[]} An array of vertices in BFS visit order starting from `start`.
  */
  bfsTraversal(start) {
    let startNode = start ?? Object.keys(this.adjacencyList)[0];
    if (!this.hasVertex(startNode)) return [];

    const visitedNodes = new Set();
    const queue = [startNode];
    const result = [];

    // Keep on iterating till queue has elements
    while (queue.length > 0) {
      const currentNode = queue.shift();
      // const currentNodeKey = String(currentNode)

      // Skip if current node is already visited
      if (visitedNodes.has(currentNode)) continue;

      const currentNodeNeighbours = this.getNeighbours(currentNode);

      // Print current node
      result.push(currentNode)

      // Add neighbours of current node to queue if they are not already visited
      for (const node of currentNodeNeighbours) {
        if (!visitedNodes.has(node)) {
          queue.push(node)
        }
      }

      // Mark current node as visited
      visitedNodes.add(currentNode);
    }

    return result;
  }

  /**
   * Traverses the graph using depth first search algorithm
   * !Time Complexity: O(n)
   * !Space Complexity: O(1)
   * @param {number} [start] - The starting vertex.
   * @returns {number[]} An array of vertices in DFS visit order starting from `start`.
  */
  dfsTraversal(start) {
    let startNode = start ?? Object.keys(this.adjacencyList)[0];

    if (!this.hasVertex(startNode)) return [];

    const visitedNodes = new Set();
    const stack = [startNode];
    const results = [];

    // Keep on iterating till stack has elements
    while (stack.length > 0) {
      const currentNode = stack.pop();

      // Skip if current node is already visited
      if (visitedNodes.has(currentNode)) continue;

      const currentNodeNeighbours = this.getNeighbours(currentNode);

      // Add current node to result
      results.push(currentNode);

      // Add neighbours of current node to stack if they are not already visited
      for (const node of currentNodeNeighbours) {
        if (!visitedNodes.has(node)) {
          stack.push(node);
        }
      }

      // Mark current node as visited
      visitedNodes.add(currentNode);
    }

    return results;
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

  /**
   * Checks if an edge exists from source vertex to destination vertex
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @param {number} source - The starting vertex of the edge
   * @param {number} destination - The ending vertex of the edge
   * @returns {boolean} True if the edge exists, false otherwise
   */
  getEdge(source, destination) {
    if (!this.hasVertex(source) || !this.hasVertex(destination)) {
      return false;
    }

    return this.adjacencyList[source].get(destination);
  }
}

module.exports = AdjacencyListGraph;
