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
        B:{A:1, C:2},
        C:{B:2, A:1}
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

    it('should return the shortest without start and finish', function() {
      var graph = new Graph({
        A:{B:1},
        B:{A:1, C:2, D: 4},
        C:{B:2, D:1},
        D:{C:1, B:4}
      }); // Shortest path A-D: A-B-C-D

      var path = graph.shortestPath('A', 'D', {trim: true});
      expect(path).to.be.an('array');
      expect(path).to.deep.equal(['B', 'C']);
    });

    it('should return the reversed path', function() {
      var graph = new Graph({
        A:{B:1},
        B:{A:1, C:2, D: 4},
        C:{B:2, D:1},
        D:{C:1, B:4}
      }); // Shortest path A-D: A-B-C-D

      var path = graph.shortestPath('A', 'D', {reverse: true});
      expect(path).to.be.an('array');
      expect(path).to.deep.equal(['A', 'B', 'C', 'D'].reverse());
    });

    it('should return the reversed triemmed path', function() {
      var graph = new Graph({
        A:{B:1},
        B:{A:1, C:2, D: 4},
        C:{B:2, D:1},
        D:{C:1, B:4}
      }); // Shortest path A-D: A-B-C-D

      var path = graph.shortestPath('A', 'D', {reverse: true, trim: true});
      expect(path).to.be.an('array');
      expect(path).to.deep.equal(['B', 'C'].reverse());
    });

    it('should return null when no path can be created', function() {
      var graph = new Graph({
        A:{B:1},
        B:{A:1, C:2, D: 4},
        C:{B:2, D:1},
        D:{C:1, B:4}
      }); // Shortest path A-D: A-B-C-D

      var path = graph.shortestPath('A', 'E');
      expect(path).to.equal(null);
    });

  });  // shortestPath

});
