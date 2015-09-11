/* global describe, it */
'use strict'

require('must')

const demand = require('must')
const sinon = require('sinon')

const Graph = require('../libs/Graph')

describe('Graph', function () {
  describe('#constructor', function () {
    it('creates an instance of Graph', function () {
      let graph = new Graph()

      graph.must.be.instanceOf(Graph)
    })

    it('populates the vertices with the passed point', function () {
      var route = new Graph({
        a: { b: 1, c: 2 }
      })

      route.graph.must.be.instanceOf(Map)
      route.graph.size.must.equal(1)
      var a = route.graph.get('a')

      a.must.be.instanceOf(Map)
    })
  })

  describe('#addNode()', function () {
    it('adds a vertex', function () {
      let route = new Graph()

      route.addNode('a', { b: 10, c: 20 })

      let node = route.graph.get('a')

      node.must.be.instanceOf(Map)
      node.get('b').must.equal(10)
      node.get('c').must.equal(20)
    })

    it('returns the Graph object', function () {
      let graph = new Graph()

      graph.addNode('a', { b: 10, c: 20 }).must.be.instanceOf(Graph)
    })
  })

  describe('#addNode()', function () {
    it('is alias of Graph#addVertex()', function () {
      let route = new Graph()
      sinon.spy(route, 'addNode')

      route.addVertex('a', { b: 1 })

      sinon.assert.calledOnce(route.addNode)
      sinon.assert.alwaysCalledOn(route.addNode, route)
    })
  })

  describe('#path()', function () {
    const vertices = {
      a: { b: 20, c: 80 },
      b: { a: 20, c: 20 },
      c: { a: 80, b: 20 }
    }

    it('retuns the shortest path', function () {
      const route = new Graph(vertices)

      const path = route.path('a', 'c')

      path.must.eql([ 'a', 'b', 'c' ])
    })

    it('retuns an object containing the cost', function () {
      const route = new Graph(vertices)

      const res = route.path('a', 'c', { cost: true })

      res.must.be.object()
      res.path.must.eql([ 'a', 'b', 'c' ])
      res.cost.must.equal(40)
    })

    it('retuns the inverted path', function () {
      const route = new Graph(vertices)

      const path = route.path('a', 'c', { reverse: true })

      path.must.eql([ 'c', 'b', 'a' ])
    })

    it('retuns an object containing the cost and inverted path', function () {
      const route = new Graph(vertices)

      const res = route.path('a', 'c', { cost: true, reverse: true })

      res.must.be.object()
      res.path.must.eql([ 'c', 'b', 'a' ])
      res.cost.must.equal(40)
    })

    it('retuns the trimmed path', function () {
      const route = new Graph(vertices)

      const path = route.path('a', 'c', { trim: true })

      path.must.eql([ 'b' ])
    })

    it('retuns an object containing the cost and trimmed path', function () {
      const route = new Graph(vertices)

      const res = route.path('a', 'c', { cost: true, trim: true })

      res.must.be.object()
      res.path.must.eql([ 'b' ])
      res.cost.must.equal(40)
    })

    it('retuns the reverse and trimmed path', function () {
      const route = new Graph(vertices)

      const path = route.path('a', 'c', { trim: true })

      path.must.eql([ 'b' ])
    })

    it('retuns an object containing the cost and inverted and trimmed path', function () {
      const route = new Graph(vertices)

      const res = route.path('a', 'c', { cost: true, reverse: true, trim: true })

      res.must.be.object()
      res.path.must.eql([ 'b' ])
      res.cost.must.equal(40)
    })

    it('returns null when no path is found', function () {
      const route = new Graph(vertices)

      const path = route.path('a', 'd')

      demand(path).be.null()
    })

    it('returns null as path and 0 as cost when no path exists and we want the cost', function () {
      const route = new Graph(vertices)

      const res = route.path('a', 'd', { cost: true })

      demand(res.path).be.null()
      res.cost.must.equal(0)
    })

    it('returns null when no vertices are defined', function () {
      const route = new Graph()

      const path = route.path('a', 'd')

      demand(path).be.null()
    })

    it('returns null as path and 0 as cost when no vertices are defined and we want the cost', function () {
      const route = new Graph()

      const res = route.path('a', 'd', { cost: true })

      demand(res.path).be.null()
      res.cost.must.equal(0)
    })

    it('works with a more complicated graph', function () {
      const route = new Graph({
        a: { b: 7, c: 9, f: 14 },
        b: { c: 10, d: 15 },
        c: { d: 11, f: 2 },
        d: { e: 6 },
        e: { f: 9 }
      })

      const path = route.path('a', 'e')

      path.must.eql([ 'a', 'c', 'd', 'e' ])
    })
  })

  describe('#shortestPath()', function () {
    it('is an alias of path', function () {
      var route = new Graph({
        a: { b: 20, c: 80 },
        b: { a: 20, c: 20 },
        c: { a: 80, b: 20 }
      })

      sinon.spy(route, 'path')

      route.shortestPath('a', 'c')
      sinon.assert.calledOnce(route.path)
    })
  })
})
