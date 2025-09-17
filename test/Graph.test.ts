import 'mocha';
import 'must';
const demand = require('must');

import { Graph } from '../src/Graph';

describe('Graph', () => {
  const vertices = {
    a: { b: 20, c: 40 },
    b: { c: 10, d: 60 },
    c: { d: 10 },
    d: { e: 10 },
    e: {},
  };

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

      demand((route as any).graph).be.instanceOf(Map);
      demand((route as any).graph.size).equal(1);

      const a = (route as any).graph.get('a');
      demand(a).be.instanceOf(Map);
    });

    it('accepts a Map as graph', () => {
      const graph = new Map();
      const a = new Map();
      a.set('b', 1);
      a.set('c', 2);
      graph.set('a', a);

      const route = new Graph(graph);

      demand((route as any).graph.size).equal(1);
    });

    it('accepts numbers as key when in a map', () => {
      const graph = new Map();
      const a = new Map();
      a.set(1, 1);
      a.set(2, 2);
      graph.set(1, a);

      const route = new Graph(graph);

      demand((route as any).graph.size).equal(1);
    });
  });

  describe('#addNode()', () => {
    it('adds a vertex', () => {
      const route = new Graph();

      route.addNode('a', { b: 10, c: 20 });

      const node = (route as any).graph.get('a');

      demand(node).be.instanceOf(Map);
      demand(node.get('b')).equal(10);
      demand(node.get('c')).equal(20);
    });

    it('returns the Graph object', () => {
      const graph = new Graph();

      demand(graph.addNode('a', { b: 10, c: 20 })).be.instanceOf(Graph);
    });

    it('accepts a map', () => {
      const route = new Graph();
      const a = new Map();
      a.set('b', 10);
      a.set('c', 20);

      route.addNode('a', a);

      const node = (route as any).graph.get('a');

      demand(node).be.instanceOf(Map);
      demand(node.get('b')).equal(10);
      demand(node.get('c')).equal(20);
    });
  });

  describe('#path()', () => {
    it('returns the shortest path', () => {
      const route = new Graph(vertices);

      const path = route.path('a', 'e');

      path!.must.eql(['a', 'b', 'c', 'd', 'e']);
    });

    it('returns an object containing the cost', () => {
      const route = new Graph(vertices);

      const res = route.path('a', 'e', { cost: true });

      res.must.be.object();
      res.path!.must.eql(['a', 'b', 'c', 'd', 'e']);
      res.cost.must.equal(50);
    });

    it('returns the inverted path', () => {
      const route = new Graph(vertices);

      const path = route.path('a', 'c', { reverse: true });

      path!.must.eql(['c', 'b', 'a']);
    });

    it('returns an object containing the cost and inverted path', () => {
      const route = new Graph(vertices);

      const res = route.path('a', 'c', { cost: true, reverse: true });

      res.must.be.object();
      res.path!.must.eql(['c', 'b', 'a']);
      res.cost.must.equal(30);
    });

    it('returns the trimmed path', () => {
      const route = new Graph(vertices);

      const path = route.path('a', 'c', { trim: true });

      path!.must.eql(['b']);
    });

    it('returns an object containing the cost and trimmed path', () => {
      const route = new Graph(vertices);

      const res = route.path('a', 'c', { cost: true, trim: true });

      res.must.be.object();
      res.path!.must.eql(['b']);
      res.cost.must.equal(30);
    });

    it('returns the reverse and trimmed path', () => {
      const route = new Graph(vertices);

      const path = route.path('a', 'c', { trim: true });

      path!.must.eql(['b']);
    });

    it('returns an object containing the cost and inverted and trimmed path', () => {
      const route = new Graph(vertices);

      const res = route.path('a', 'c', {
        cost: true,
        reverse: true,
        trim: true,
      });

      res.must.be.object();
      res.path!.must.eql(['b']);
      res.cost.must.equal(30);
    });

    it('returns null when no path is found', () => {
      const route = new Graph(vertices);

      const path = route.path('a', 'x' as any);

      demand(path).be.null();
    });

    it('returns null as path and 0 as cost when no path exists and we want the cost', () => {
      const route = new Graph(vertices);

      const res = route.path('a', 'x' as any, { cost: true });

      demand(res.path).be.null();
      res.cost.must.equal(0);
    });

    it('returns null when no vertices are defined', () => {
      const route = new Graph();

      const path = route.path('a', 'd');

      demand(path).be.null();
    });

    it('returns null as path and 0 as cost when no vertices are defined and we want the cost', () => {
      const route = new Graph();

      const res = route.path('a', 'd', { cost: true });

      demand(res.path).be.null();
      res.cost.must.equal(0);
    });

    it('returns the same path if a node which is not part of the shortest path is avoided', () => {
      const route = new Graph(vertices);

      const path = route.path('a', 'e', { avoid: ['x'] });

      path!.must.eql(['a', 'b', 'c', 'd', 'e']);
    });

    it('returns a different path if a node which is part of the shortest path is avoided', () => {
      const route = new Graph(vertices);

      const path = route.path('a', 'e', { avoid: ['c'] });

      path!.must.eql(['a', 'b', 'd', 'e']);
    });

    it('throws an error if the start node is avoided', () => {
      const route = new Graph(vertices);

      demand(() => route.path('a', 'e', { avoid: ['a'] })).throw();
    });

    it('throws an error if the end node is avoided', () => {
      const route = new Graph(vertices);

      demand(() => route.path('a', 'e', { avoid: ['e'] })).throw();
    });

    it('returns the same path and cost if a node which is not part of the graph is avoided', () => {
      const route = new Graph(vertices);

      const res = route.path('a', 'e', { cost: true, avoid: ['x'] });

      res.path!.must.eql(['a', 'b', 'c', 'd', 'e']);
      res.cost.must.equal(50);
    });

    it('works with a more complicated graph', () => {
      const graph = {
        a: { b: 2, c: 1 },
        b: { d: 3 },
        c: { d: 1, e: 4 },
        d: { e: 1, f: 1 },
        e: { f: 1 },
        f: {},
      };

      const route = new Graph(graph);

      route.path('a', 'f')!.must.eql(['a', 'c', 'd', 'f']);
    });
  });

  describe('#removeNode()', () => {
    it('removes a previously set node from the graph', () => {
      const route = new Graph({
        a: { b: 1, c: 5 },
        b: { a: 3 },
        c: { b: 2, a: 2 },
      });

      route.removeNode('c');

      const nodeA = (route as any).graph.get('a');
      demand(nodeA.get('c')).be.undefined();
    });

    it('removes all references to the removed node', () => {
      const route = new Graph({
        a: { b: 1, c: 5 },
        b: { a: 3 },
        c: { b: 2, a: 2 },
      });

      route.removeNode('c');

      demand((route as any).graph.has('c')).be.false();
    });
  });
});