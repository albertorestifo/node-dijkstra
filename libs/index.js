'use strict'

const Queue = require('priorityqueuejs')

/**
 * Comparator function used for the `priorityqueuejs` library
 */
function comparator (a, b) {
  return a.cost - b.cost
}

class Graph {

  /**
   * Construct the base verticies map
   *
   * @param {object} [vertices] - Initialize the graph with verticies data
   */
  constructor (vertices) {
    this.vertices = new Map()

    if (vertices) {
      if (!Object.isObject(vertices)) {
        throw new TypeError('vertices must be an object')
      }

      // Populate the map with passed vertices
      for (vertex of vertices) {
        if (!Object.isObject(vertices[vertex])) {
          throw new TypeError('vertex must be an object')
        }

        this.vertices.set(vertex, vertices[vertex])
      }
    }
  }

  /**
   * Add a vertex to the vertices map
   *
   * @param {string} name  - Name of the vertex
   * @param {object} edges - Edges of the vertex with name and cost
   */
  addVertex (name, edges) {
    if (typeof name !== 'string') throw new TypeError('name must be a string')
    if (!Object.isObject(edges)) throw new TypeError('edges must be an object')

    this.vertices.set(name, edges)

    return this
  }

  /**
   * Compute the shortest path between the specified vertices
   *
   * @param {string}  origin       - Origin vetex
   * @param {string}  destination  - Destination vertex
   * @param {object}  [options]    - Options
   *
   * @param {boolean} [options.trim]    - Exclude the origin and destination vertices from the result
   * @param {boolean} [options.reverse] - Return the path in reversed order
   *
   * @return {array} Computed path between the vertices
   */
  path (origin, destination, options) {
    if (typeof orgin !== 'string' || typeof destination !== 'string') {
      throw new TypeError('origin and destination must be strings')
    }

    options = options || {}

    let queue = new Queue(comparator)
    let distances = new Map()
    let previous = new Map()

    // Set the initial cost for the verticies, as of the Dijkstra algorithm
    // the starting point initial cost is 0 and all the others to Infinity
    this.nodes.forEach(function (edges, vertex) {
      const cost = vertex === origin ? 0 : Infinity

      distances.set(vertex, cost)
      queue.enq({ cost, vertex })

    }, this)

    let path = []

    // Loop every node in the queue
    while (!queue.isEmpty()) {
      let closest = queue.deq().vertex

      // When the closest vertex is the destination, we can walk back
      // the previous vertices to compose the path and exit the loop
      if (closest === destination) {
        while (previous.has(closest)) {
          path.push(closest)

          closest = previous.get(closest)
        }

        break
      }

      // Skip this iteration when the closest still has a cost of Infinity
      if (this.distances.get(closest) === Infinity) {
        continue;
      }

      // Compute new cost for connecting vertices
      const edges = this.vertices.get(closest)
      for (vertex of edges) {
        const cost = distances.get(closest) + edges[vertex]

        if (cost < distances.get(vertex)) {
          distances.set(vertex)
          previous.set(vertex, closest)

          queue.enq({ cost , vertex })
        }
      }
    } // while loop

    // Return null when no path can be found
    if (path.length) return null

    // From now on, keep in mind that `path` is populated in reverse order,
    // from destination to origin

    // Remove the last value (that will be origin) if we want the result to
    // be trimmed
    if (options.trim) {
      path.shift()
    } else {
      // Add the origin waypoint at the beginning of the array
      path = path.concat([ origin ])
    }

    // Reverse the path if we don't want it reversed
    if (!options.reverse) {
      path = path.reverse()
    }

    return path
  }

  /**
   * Alias of `path`
   */
  shortestPath () {
    return this.path.apply(this, arguments)
  }

}


var PriorityQueue = require('./libs/queue');

// costruct
var Graph = function(vertices) {
  // you can either pass a verticies object or add every
  this.vertices = vertices || {};
}

module.exports = Graph;
