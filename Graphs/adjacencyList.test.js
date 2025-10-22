const Graph = require("./adjacencyList");

describe("Graph", () => {
  describe("Initialization", () => {
    it("should initialize an empty adjacency list when no vertices are provided", () => {
      const graph = new Graph();
      expect(graph.getVertices()).toEqual([]);
    });

    it("should initialize graph with provided vertices", () => {
      const graph = new Graph(false, 2, 3, 1);
      expect(graph.getVertices().map(Number).sort()).toEqual([1, 2, 3]);
    });

    it("should respect graph direction flag", () => {
      const graph1 = new Graph(false, 1, 2, 3);
      const graph2 = new Graph(true, 1, 2, 3);

      expect(graph1.isDirected()).toBe(false);
      expect(graph2.isDirected()).toBe(true);
    });
  });
});
