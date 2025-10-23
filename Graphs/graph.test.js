const AdjListGraph = require("./adjacencyList");
const AdjMatrixGraph = require("./adjacencyMatrix");

function runGraphTests(GraphClass) {
  describe(`Graph tests for ${GraphClass.name}`, () => {
    describe("Initialization", () => {
      it("should initialize an empty adjacency list when no vertices are provided", () => {
        const graph = new GraphClass();
        expect(graph.getVertices()).toEqual([]);
      });

      it("should initialize graph with provided vertices", () => {
        const graph = new GraphClass(false, 2, 3, 1);
        expect(graph.getVertices().map(Number).sort()).toEqual([1, 2, 3]);
      });

      it("should respect graph direction", () => {
        const graph1 = new GraphClass(false, 1, 2, 3);
        const graph2 = new GraphClass(true, 1, 2, 3);

        expect(graph1.isDirected()).toBe(false);
        expect(graph2.isDirected()).toBe(true);
      });
    });

    describe("Vertex Operations", () => {
      it("should be able to add a vertex", () => {
        const graph = new GraphClass(false);

        expect(graph.hasVertex(1)).toEqual(false);
        graph.addVertex(1);

        expect(graph.hasVertex(1)).toEqual(true);
      });

      it("should return the vertex value when added successfully", () => {
        const graph = new GraphClass(false);

        const result = graph.addVertex(1);

        expect(result).toEqual(1);
      });

      it("should not duplicate a vertex when added twice", () => {
        const graph = new GraphClass(false, 1);

        expect(graph.hasVertex(1)).toEqual(true);
        expect(graph.size()).toEqual(1);

        graph.addVertex(1);

        expect(graph.hasVertex(1)).toEqual(true);
        expect(graph.size()).toEqual(1);
      });

      it("should return false when vertex is not added", () => {
        const graph = new GraphClass(false, 1);

        // Validating presence of vertex 1 in graph
        expect(graph.hasVertex(1)).toEqual(true);
        expect(graph.size()).toEqual(1);

        const result = graph.addVertex(1);

        // Validating result of adding an already present vertex 1
        expect(graph.hasVertex(1)).toEqual(true);
        expect(graph.size()).toEqual(1);
        expect(result).toEqual(false);
      });

      it("should be able to remove a vertex", () => {
        const graph = new GraphClass(false, 1);

        expect(graph.hasVertex(1)).toEqual(true);

        graph.removeVertex(1);

        expect(graph.hasVertex(1)).toEqual(false);
      });

      it("should correctly remove a vertex from its neighbours", () => {
        const graph = new GraphClass(false, 1, 2, 3, 4);

        // Adding edges from vertex 1 to others
        graph.addEdge(1, 2);
        graph.addEdge(1, 3);
        graph.addEdge(1, 4);

        // Validating neighbour presence of 1 in other vertices
        expect(graph.getNeighbours(1).size).toEqual(3);
        expect(graph.getNeighbours(2).has(1)).toBe(true);
        expect(graph.getNeighbours(3).has(1)).toBe(true);
        expect(graph.getNeighbours(4).has(1)).toBe(true);

        graph.removeVertex(1);

        // Validating vertex 1 is no longer the neighbour of other vertices
        expect(graph.hasVertex(1)).toBe(false);
        expect(graph.getNeighbours(2).has(1)).toBe(false);
        expect(graph.getNeighbours(3).has(1)).toBe(false);
        expect(graph.getNeighbours(4).has(1)).toBe(false);
      });

      it("should return removed vertex value when removed successfully", () => {
        const graph = new GraphClass(false, 1);

        expect(graph.hasVertex(1)).toEqual(true);

        const result = graph.removeVertex(1);

        expect(graph.size()).toEqual(0);
        expect(result).toEqual(1);
      });

      it("should return false when trying to remove a vertex that does not exist", () => {
        const graph = new GraphClass(false, 1);

        const result = graph.removeVertex(2);

        expect(result).toEqual(false);
      });
    });

    describe("Edge Operations", () => {
      it("should be able to add an edge between 2 vertices", () => {
        const graph = new GraphClass(false, 1, 2);

        graph.addEdge(1, 2);

        const neighbours1 = graph.getNeighbours(1);
        const neighbours2 = graph.getNeighbours(2);

        // Validating presence of vertices 2 and 1 in vertices 1 and 2 respectively
        expect(neighbours1.has(2)).toBe(true);
        expect(neighbours2.has(1)).toBe(true);
      });

      it("should return pair of vertices when edge between them is added successfully", () => {
        const graph = new GraphClass(false, 1, 2);

        const result = graph.addEdge(1, 2);
        expect(result).toEqual([1, 2]);
      });

      it("should automatically add missing vertices when adding an edge", () => {
        const graph = new GraphClass();

        expect(graph.getVertices()).toEqual([]);

        graph.addEdge(1, 2);

        expect(graph.hasVertex(1)).toEqual(true);
        expect(graph.hasVertex(2)).toEqual(true);
      });

      it("should not duplicate an edge when added twice", () => {
        const graph = new GraphClass(false, 1, 2);

        graph.addEdge(1, 2);

        let neighbours1 = graph.getNeighbours(1);
        let neighbours2 = graph.getNeighbours(2);

        // Checking neighbour values and count of vertices 1 and 2 after adding an edge
        expect(neighbours1.size).toEqual(1);
        expect(neighbours2.size).toEqual(1);
        expect(neighbours1.has(2)).toBe(true);
        expect(neighbours2.has(1)).toBe(true);

        graph.addEdge(1, 2);

        neighbours1 = graph.getNeighbours(1);
        neighbours2 = graph.getNeighbours(2);

        // Checking neighbour values and count of vertices 1 and 2 after adding the same edge again
        expect(neighbours1.size).toEqual(1);
        expect(neighbours2.size).toEqual(1);
        expect(neighbours1.has(2)).toBe(true);
        expect(neighbours2.has(1)).toBe(true);
      });

      it("should return false when edge is not added", () => {
        const graph = new GraphClass(false, 1, 2);

        graph.addEdge(1, 2);

        const result = graph.addEdge(1, 2);

        expect(result).toEqual(false);
      });

      it("should add edges bidirectionally for undirected graphs", () => {
        const graph = new GraphClass(false, 1, 2);

        graph.addEdge(1, 2);

        const neighbours1 = graph.getNeighbours(1);
        const neighbours2 = graph.getNeighbours(2);

        expect(neighbours1.has(2)).toBe(true);
        expect(neighbours2.has(1)).toBe(true);
      });

      it("should add edges in one direction for directed graphs", () => {
        const graph = new GraphClass(true, 1, 2);

        graph.addEdge(1, 2);

        const neighbours1 = graph.getNeighbours(1);
        const neighbours2 = graph.getNeighbours(2);

        expect(neighbours1.has(2)).toBe(true);
        expect(neighbours2.has(1)).toBe(false);
      });

      it("should remove neighbors from both vertices in undirected graphs when edge is removed", () => {
        const graph = new GraphClass(false, 1, 2);

        graph.addEdge(1, 2);

        let neighbours1 = graph.getNeighbours(1);
        let neighbours2 = graph.getNeighbours(2);

        // Validating presence of vertices 2 and 1 in vertices 1 and 2 respectively and count of neighbours
        expect(neighbours1.size).toEqual(1);
        expect(neighbours2.size).toEqual(1);
        expect(neighbours1.has(2)).toBe(true);
        expect(neighbours2.has(1)).toBe(true);

        graph.removeEdge(1, 2);

        neighbours1 = graph.getNeighbours(1);
        neighbours2 = graph.getNeighbours(2);

        // Validating vertices 2 and 1 are no longer the neighbours of vertices 1 and 2 respectively
        expect(neighbours1.size).toEqual(0);
        expect(neighbours2.size).toEqual(0);
        expect(neighbours1.has(2)).toBe(false);
        expect(neighbours2.has(1)).toBe(false);
      });

      it("should remove only the specified edge in directed graphs when edge is removed", () => {
        const graph = new GraphClass(true, 1, 2);

        graph.addEdge(1, 2);
        graph.addEdge(2, 1);

        let neighbours1 = graph.getNeighbours(1);
        let neighbours2 = graph.getNeighbours(2);

        // Validating presence of vertices 2 and 1 in vertices 1 and 2 respectively and count of neighbours
        expect(neighbours1.size).toEqual(1);
        expect(neighbours2.size).toEqual(1);
        expect(neighbours1.has(2)).toBe(true);
        expect(neighbours2.has(1)).toBe(true);

        graph.removeEdge(1, 2);

        neighbours1 = graph.getNeighbours(1);
        neighbours2 = graph.getNeighbours(2);

        // Validating presence of vertex 1 as the neighbour of vertex 1 and vertex 2 is no longer the neighbour of vertex 1
        expect(neighbours1.size).toEqual(0);
        expect(neighbours2.size).toEqual(1);
        expect(neighbours1.has(2)).toBe(false);
        expect(neighbours2.has(1)).toBe(true);
      });

      it("should return removed edge when removed successfully", () => {
        const graph = new GraphClass(false, 1, 2);

        graph.addEdge(1, 2);

        let neighbours1 = graph.getNeighbours(1);
        let neighbours2 = graph.getNeighbours(2);

        // Validating presence of vertices 2 and 1 in vertices 1 and 2 respectively and count of neighbours
        expect(neighbours1.size).toEqual(1);
        expect(neighbours2.size).toEqual(1);
        expect(neighbours1.has(2)).toBe(true);
        expect(neighbours2.has(1)).toBe(true);

        const result = graph.removeEdge(1, 2);

        expect(result).toEqual([1, 2]);
      });

      it("should return false when trying to remove an edge that does not exist", () => {
        const graph = new GraphClass(false, 1, 2);

        const result = graph.removeEdge(1, 2);

        expect(result).toEqual(false);
      });

      it("should return false when trying to remove an edge from a vertex that does not exist", () => {
        const graph = new GraphClass(false, 1, 2);

        const result = graph.removeEdge(3, 2);

        expect(result).toEqual(false);
      });
    });

    describe("Helper Methods", () => {
      it("should return the correct size (number of vertices) of the graph", () => {
        const graph = new GraphClass(false, 1, 2, 3);
        expect(graph.size()).toEqual(3);

        graph.addVertex(4);
        expect(graph.size()).toEqual(4);

        graph.removeVertex(2);
        expect(graph.size()).toEqual(3);
      });

      it("should return all vertices as strings", () => {
        const graph = new GraphClass(false, 1, 2);
        const vertices = graph.getVertices();

        expect(vertices).toEqual(expect.arrayContaining(["1", "2"]));
      });

      it("should correctly check vertex existence", () => {
        const graph = new GraphClass(false);
        graph.addVertex(5);

        expect(graph.hasVertex(5)).toBe(true);
        expect(graph.hasVertex(10)).toBe(false);
      });

      it("should correctly check edge existence", () => {
        const graph = new GraphClass(false, 1, 2);
        graph.addEdge(1, 2);

        expect(graph.hasEdge(1, 2)).toBe(true);
        expect(graph.hasEdge(2, 1)).toBe(true);
        expect(graph.hasEdge(1, 3)).toBe(false);
        expect(graph.hasEdge(3, 1)).toBe(false);
      });

      it("should return the neighbours set correctly", () => {
        const graph = new GraphClass(false, 1, 2, 3);
        graph.addEdge(1, 2);
        graph.addEdge(1, 3);

        const neighbours = graph.getNeighbours(1);

        expect(neighbours.has(2)).toBe(true);
        expect(neighbours.has(3)).toBe(true);
      });

      it("should correctly report if the graph is directed", () => {
        const undirectedGraph = new GraphClass(false);
        expect(undirectedGraph.isDirected()).toBe(false);

        const directedGraph = new GraphClass(true);
        expect(directedGraph.isDirected()).toBe(true);
      });
    });
  });
}

runGraphTests(AdjListGraph);
runGraphTests(AdjMatrixGraph);
