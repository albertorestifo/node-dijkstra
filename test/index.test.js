/* global describe, it */
'use strict'

require('must')

// const sinon = require('sinon')

const Graph = require('../libs/')

describe('Graph', function () {

  describe('#constructor', function () {

    it('creates an instance of Graph', function () {
      let graph = new Graph()

      graph.must.be.instanceOf(Graph)
    })

    it('populates the vertices with the passed point', function () {
      var graph = new Graph({
        a: { b: 1, c: 2 }
      })

      graph.vertices.must.be.instanceOf(Map)
      graph.vertices.size.must.equal(1)
      graph.vertices.get('a').must.be.object()
    })

  })

  describe('#addVertex()', function () {
    it('adds a vertex', function () {
      let graph = new Graph()

      graph.addVertex('a', { b: 10, c: 20 })

      let vertex = graph.vertices.get('a')

      vertex.must.be.object()
      vertex.must.have.keys([ 'b', 'c' ])
    })

    it('returns the Graph object', function () {
      let graph = new Graph()

      graph.addVertex('a', { b: 10, c: 20 }).must.be.instanceOf(Graph)
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

    it('retuns the inverted path', function () {
      const route = new Graph(vertices)

      const path = route.path('a', 'c', { reverse: true })

      path.must.eql([ 'c', 'b', 'a' ])
    })

    it('retuns the trimmed path', function () {
      const route = new Graph(vertices)

      const path = route.path('a', 'c', { trim: true })

      path.must.eql([ 'b' ])
    })

    it('retuns the reverse and trimmed path', function () {
      const route = new Graph(vertices)

      const path = route.path('a', 'c', { trim: true })

      path.must.eql([ 'b' ])
    })

    it('works with a more complicated graph', function () {
      // solution 1-6: 1, 3, 5, 6
      const route = new Graph({
        '1': { '2': 10, '3': 20, '4': 30 },
        '2': { '1': 10, '3': 20 },
        '3': { '2': 20, '1': 20, '5': 10 },
        '4': { '1': 30, '5': 10 },
        '5': { '4': 10, '3': 10, '6': 20, '7': 10 },
        '6': { '5': 20, '7': 20 },
        '7': { '5': 10, '6': 20 }
      })

      const path = route.path('1', '6')

      path.must.eql([ '1', '3', '5', '6' ])
    })

  })

})
