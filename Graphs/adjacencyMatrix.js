class Graph {
  constructor(...items) {
    this.isDirectedGraph = items[0] ?? false;
    this.vertices = items.slice(1) ?? [];

    this.vertexIndexMap = new Map(this.vertices.map((v, i) => [v, i]));
    this.adjacencyMatrix = Array.from({ length: this.vertices.length }, () =>
      new Array(this.vertices.length).fill(0)
    );
  }

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

  addEdge(source, destination) {
    if (!this.hasVertex(source)) {
      this.addVertex(source);
    }

    if (!this.hasVertex(destination)) {
      this.addVertex(destination);
    }

    const sourceIdx = this.vertexIndexMap.get(source);
    const destinationIdx = this.vertexIndexMap.get(destination);

    if (this.adjacencyMatrix[sourceIdx][destinationIdx] === 1) {
      return false;
    }

    this.adjacencyMatrix[sourceIdx][destinationIdx] = 1;

    if (!this.isDirected()) {
      this.adjacencyMatrix[destinationIdx][sourceIdx] = 1;
    }

    return [source, destination];
  }

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

  getNeighbours(node) {
    if (!this.hasVertex(node)) {
      return new Set();
    }

    const nodeIdx = this.vertexIndexMap.get(node);
    const results = this.adjacencyMatrix[nodeIdx]
      .map((v, i) => (v === 1 ? this.vertices[i] : null))
      .filter(Boolean);

    return new Set(results);
  }

  getVertices() {
    return this.vertices.map(String);
  }

  isDirected() {
    return this.isDirectedGraph;
  }

  hasVertex(node) {
    return this.vertices.indexOf(node) >= 0;
  }

  hasEdge(source, destination) {
    if (!this.hasVertex(source) || !this.hasVertex(destination)) {
      return false;
    }

    const sourceIdx = this.vertexIndexMap.get(source);
    const destinationIdx = this.vertexIndexMap.get(destination);

    return !!this.adjacencyMatrix[sourceIdx][destinationIdx];
  }

  size() {
    return this.vertices.length;
  }
}

module.exports = Graph;
