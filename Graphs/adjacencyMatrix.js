class AdjacencyMatrixGraph {
  constructor(...items) {
    this.isDirectedGraph = items[0] ?? false;
    this.vertices = items.slice(1) ?? [];

    this.vertexIndexMap = new Map(this.vertices.map((v, i) => [v, i]));
    this.adjacencyMatrix = Array.from({ length: this.vertices.length }, () =>
      new Array(this.vertices.length).fill(0)
    );
  }

  /**
   * Inserts a new vertex to the graph
   * !Time Complexity: O(V^2)
   * !Space Complexity: O(V^2)
   * @param {number} value - The value of the new vertex to insert.
   * @returns {number|false} The vertex value if added; otherwise, false if already present.
   */
  addVertex(value) {
    if (this.hasVertex(value)) {
      return false;
    }

    this.vertices.push(value);
    this.vertexIndexMap.set(value, this.vertices.length - 1);

    this.adjacencyMatrix.forEach((row) => row.push(0));
    this.adjacencyMatrix.push(new Array(this.vertices.length).fill(0));

    return value;
  }

  /**
   * Removes a vertex from the graph
   * !Time Complexity: O(V^2)
   * !Space Complexity: O(V^2)
   * @param {number} value - The vertex to remove.
   * @returns {number|false} The vertex if removed; false if it does not exist.
   */
  removeVertex(value) {
    if (!this.hasVertex(value)) {
      return false;
    }

    const vertexIndex = this.vertices.indexOf(value);

    this.vertices.splice(vertexIndex, 1);
    this.vertexIndexMap.delete(value);

    this.adjacencyMatrix.splice(vertexIndex, 1);
    this.adjacencyMatrix.forEach((row) => row.splice(vertexIndex, 1));

    // Rebuilding vertex-index map due to potential indices shift
    this.vertexIndexMap = new Map(this.vertices.map((v, i) => [v, i]));

    return value;
  }

  /**
   * Adds an edge between the two provided vertices
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @param {number} sourceVertex - The value of the vertex where the edge
   * starts from
   * @param {number} destination - The value of the vertex where the edge
   * ends
   * @param {number} weight - The value of the weight of the edge
   * @returns {Array|false} Edge endpoints if added; false if edge already exists.
   */
  addEdge(source, destination, weight = 1) {
    if (!this.hasVertex(source)) {
      this.addVertex(source);
    }

    if (!this.hasVertex(destination)) {
      this.addVertex(destination);
    }

    const sourceIdx = this.vertexIndexMap.get(source);
    const destinationIdx = this.vertexIndexMap.get(destination);

    if (this.adjacencyMatrix[sourceIdx][destinationIdx] !== 0) {
      return false;
    }

    this.adjacencyMatrix[sourceIdx][destinationIdx] = weight;

    if (!this.isDirected()) {
      this.adjacencyMatrix[destinationIdx][sourceIdx] = weight;
    }

    return [source, destination, weight];
  }

  /**
   * Removes the edge(s) between the two provided vertices
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @param {number} sourceVertex - The value of the vertex where the edge
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

    const sourceIdx = this.vertexIndexMap.get(source);
    const destinationIdx = this.vertexIndexMap.get(destination);

    this.adjacencyMatrix[sourceIdx][destinationIdx] = 0;

    if (!this.isDirected()) {
      this.adjacencyMatrix[destinationIdx][sourceIdx] = 0;
    }

    return [source, destination];
  }

  /**
   * Returns the set containing the neighbours of a vertex
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @param {number} value - The value of the vertex whose neighbours needs to be returned
   * @returns {Set}  Set of neighbors
   */
  getNeighbours(value) {
    if (!this.hasVertex(value)) {
      return new Set();
    }

    const nodeIdx = this.vertexIndexMap.get(value);
    const results = this.adjacencyMatrix[nodeIdx]
      .map((v, i) => (v === 1 ? this.vertices[i] : null))
      .filter(Boolean);

    return new Set(results);
  }

  /**
   * Returns a list of nodes in the graph
   * !Time Complexity: O(V)
   * !Space Complexity: O(1)
   * @returns {string[]} Array of vertex keys as strings
   */
  getVertices() {
    return this.vertices.map(String);
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
   * Checks if the graph has a certain vertex
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @param {number} node - The value of the vertex whose presence needs to be checked
   * @returns {boolean}
   */
  hasVertex(node) {
    return this.vertexIndexMap.has(node);
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

    const sourceIdx = this.vertexIndexMap.get(source);
    const destinationIdx = this.vertexIndexMap.get(destination);

    return !!this.adjacencyMatrix[sourceIdx][destinationIdx];
  }

  /**
   * Returns the number of nodes in the graph
   * !Time Complexity: O(1)
   * !Space Complexity: O(1)
   * @returns {number} The number of nodes in the graph
   */
  size() {
    return this.vertices.length;
  }
}

module.exports = AdjacencyMatrixGraph;
