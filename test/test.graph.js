var expect = require('chai').expect;
var Graph = require('../graph');

describe('Graph', function() {

  describe('constructor', function() {

    it('should return the Graph object', function() {
      var graph = new Graph();

      expect(graph).to.respondTo('shortestPath');
    });

    it('should set the starting vertices to an empty object', function() {
      var graph = new Graph();

      expect(graph.vertices).to.be.empty;
    });

    it('should set the starting vertices', function() {
      var graph = new Graph({A:{B:1, C:2}});

      expect(graph.vertices).not.to.be.empty;
    });

  });

  describe('addVertex()', function() {
    it('should add a vertex', function() {
      var graph = new Graph();
      graph.addVertex('A', {B: 1});

      expect(graph.vertices).not.to.be.empty;
    });
  });  // addVertex

  describe('shortestPath()', function() {

    it('should return an array', function() {
      var graph = new Graph({
        A:{B:1, C:2},
        B:{A:1, C:2}
      });

      var path = graph.shortestPath('A', 'C');
      expect(path).to.be.an('array');
    });

    it('should return the shortest path', function() {
      var graph = new Graph({
        A:{B:1},
        B:{A:1, C:2, D: 4},
        C:{B:2, D:1},
        D:{C:1, B:4}
      }); // Shortest path A-D: A-B-C-D

      var path = graph.shortestPath('A', 'D');
      expect(path).to.be.an('array');
      expect(path).to.deep.equal(['A', 'B', 'C', 'D']);
    });

  });  // shortestPath

});
