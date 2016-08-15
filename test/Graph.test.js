/* eslint-env node, mocha */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

require('must');
const demand = require('must');
const sinon = require('sinon');

const Graph = require('../libs/Graph');

describe('Graph', () => {
  describe('#constructor', () => {
    it('creates an instance of Graph', () => {
      const graph = new Graph();

      demand(graph).be.instanceOf(Graph);
      graph.must.be.instanceOf(Graph);
    });

    it('populates the vertices with the passed point', () => {
      const route = new Graph({
        a: { b: 1, c: 2 },
      });

      demand(route.graph).be.instanceOf(Map);
      demand(route.graph.size).equal(1);

      const a = route.graph.get('a');
      demand(a).be.instanceOf(Map);
    });
  });

  describe('#addNode()', () => {
    it('adds a vertex', () => {
      const route = new Graph();

      route.addNode('a', { b: 10, c: 20 });

      const node = route.graph.get('a');

      demand(node).be.instanceOf(Map);
      demand(node.get('b')).equal(10);
      demand(node.get('c')).equal(20);
    });

    it('returns the Graph object', () => {
      const graph = new Graph();

      demand(graph.addNode('a', { b: 10, c: 20 })).be.instanceOf(Graph);
    });
  });

  describe('#addNode()', () => {
    it('is alias of Graph#addVertex()', () => {
      const route = new Graph();
      const spy = sinon.spy(route, 'addNode');

      route.addVertex('a', { b: 1 });

      sinon.assert.calledOnce(spy);
      sinon.assert.alwaysCalledOn(spy, route);
    });
  });

  describe('#path()', () => {
    const vertices = {
      a: { b: 20, c: 80 },
      b: { a: 20, c: 20 },
      c: { a: 80, b: 20 },
    };

    it('retuns the shortest path', () => {
      const route = new Graph(vertices);

      const path = route.path('a', 'c');

      path.must.eql(['a', 'b', 'c']);
    });

    it('retuns an object containing the cost', () => {
      const route = new Graph(vertices);

      const res = route.path('a', 'c', { cost: true });

      res.must.be.object();
      res.path.must.eql(['a', 'b', 'c']);
      res.cost.must.equal(40);
    });

    it('retuns the inverted path', () => {
      const route = new Graph(vertices);

      const path = route.path('a', 'c', { reverse: true });

      path.must.eql(['c', 'b', 'a']);
    });

    it('retuns an object containing the cost and inverted path', () => {
      const route = new Graph(vertices);

      const res = route.path('a', 'c', { cost: true, reverse: true });

      res.must.be.object();
      res.path.must.eql(['c', 'b', 'a']);
      res.cost.must.equal(40);
    });

    it('retuns the trimmed path', () => {
      const route = new Graph(vertices);

      const path = route.path('a', 'c', { trim: true });

      path.must.eql(['b']);
    });

    it('retuns an object containing the cost and trimmed path', () => {
      const route = new Graph(vertices);

      const res = route.path('a', 'c', { cost: true, trim: true });

      res.must.be.object();
      res.path.must.eql(['b']);
      res.cost.must.equal(40);
    });

    it('retuns the reverse and trimmed path', () => {
      const route = new Graph(vertices);

      const path = route.path('a', 'c', { trim: true });

      path.must.eql(['b']);
    });

    it('retuns an object containing the cost and inverted and trimmed path', () => {
      const route = new Graph(vertices);

      const res = route.path('a', 'c', { cost: true, reverse: true, trim: true });

      res.must.be.object();
      res.path.must.eql(['b']);
      res.cost.must.equal(40);
    });

    it('returns null when no path is found', () => {
      const route = new Graph(vertices);

      const path = route.path('a', 'd');

      demand(path).be.null();
    });

    it('returns null as path and 0 as cost when no path exists and we want the cost', () => {
      const route = new Graph(vertices);

      const res = route.path('a', 'd', { cost: true });

      demand(res.path).be.null();
      res.cost.must.equal(0);
    });

    it('returns null when no vertices are defined', () => {
      const route = new Graph();

      const path = route.path('a', 'd');

      demand(path).be.null();
    });

    it('returns null as path and 0 as cost when no vertices are defined and we want the cost',
    () => {
      const route = new Graph();

      const res = route.path('a', 'd', { cost: true });

      demand(res.path).be.null();
      res.cost.must.equal(0);
    });

    it('works with a more complicated graph', () => {
      const route = new Graph({
        a: { b: 7, c: 9, f: 14 },
        b: { c: 10, d: 15 },
        c: { d: 11, f: 2 },
        d: { e: 6 },
        e: { f: 9 },
      });

      const path = route.path('a', 'e');

      path.must.eql(['a', 'c', 'd', 'e']);
    });
  });

  describe('#shortestPath()', () => {
    it('is an alias of path', () => {
      const route = new Graph({
        a: { b: 20, c: 80 },
        b: { a: 20, c: 20 },
        c: { a: 80, b: 20 },
      });

      sinon.spy(route, 'path');

      route.shortestPath('a', 'c');
      sinon.assert.calledOnce(route.path);
    });
  });

  describe('#removeNode()', () => {
    it('removes a previously set node from the graph', () => {
      const route = new Graph({
        a: { b: 20, c: 80 },
        b: { a: 20, c: 20 },
        c: { a: 80, b: 20 },
      });

      route.removeNode('c');

      route.graph.has('c').must.be.false();
      route.graph.has('a').must.be.true();
      route.graph.has('b').must.be.true();
    });

    it('removes all references to the removed node', () => {
      const route = new Graph({
        a: { b: 20, c: 80 },
        b: { a: 20, c: 20 },
        c: { a: 80, b: 20 },
      });

      route.removeNode('c');

      route.graph.has('c').must.be.false();
      route.graph.get('b').has('c').must.be.false();
      route.graph.get('a').has('c').must.be.false();
    });
  });
});
