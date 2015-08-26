'use strict'

const Queue = require('./PriorityQueue')
const populateMap = require('./populateMap')

class Graph {

  /**
   * Construct the base verticies map
   *
   * @param {object} [graph] - Initialize the graph with nodes
   */
  constructor (graph) {
    this.graph = new Map()

    if (graph) populateMap(this.graph, graph, Object.keys(graph))
  }

  /**
   * Add a vertex to the vertices map
   *
   * @param {string} name      - Name of the vertex
   * @param {object} neighbors - Neighbouring nodes
   */
  addVertex (name, neighbors) {
    let _neighbors = new Map()

    populateMap(_neighbors, neighbors, Object.keys(neighbors))
    this.graph.set(name, _neighbors)

    return this
  }

  /**
   * Compute the shortest path between the specified vertices
   *
   * @param {string}  start        - Origin node
   * @param {string}  goal         - Destination node
   * @param {object}  [options]    - Options
   *
   * @param {boolean} [options.trim]    - Exclude the origin and destination vertices from the result
   * @param {boolean} [options.reverse] - Return the path in reversed order
   *
   * @return {array} Computed path between the nodes
   */
  path (start, goal, options) {
    options = options || {}

    // If we have no vertices set, we return null
    if (!this.graph.size) return null

    // Use Uniform-cost Search for better performances
    let frontier = new Queue()
    let explored = new Set()
    let previous = new Map()
    let path = []

    frontier.set(start, 0)

    while (!frontier.isEmpty()) {
      let node = frontier.next()

      if (node.key === goal) {
        // RESULT
        let _nodeKey = node.key
        while (previous.has(_nodeKey)) {
          path.push(_nodeKey)
          _nodeKey = previous.get(_nodeKey)
        }

        break
      }

      explored.add(node.key)

      let neighbors = this.graph.get(node.key) || new Map()
      neighbors.forEach(function (_cost, _node) {
        // Skip the neighbor if it was already explored
        if (explored.has(_node)) return false

        if (!frontier.has(_node)) {
          previous.set(_node, node.key)
          return frontier.set(_node, node.priority + _cost)
        }

        var frontierPriority = frontier.get(_node).priority
        var nodeCost = node.priority + _cost

        if (nodeCost < frontierPriority) {
          previous.set(_node, node.key)
          frontier.set(_node, nodeCost)
        }
      })
    }

    // Return null when no path can be found
    if (!path.length) return null

    // From now on, keep in mind that `path` is populated in reverse order,
    // from destination to origin

    // Remove the last value (that will be origin) if we want the result to
    // be trimmed
    if (options.trim) {
      path.shift()
    } else {
      // Add the origin waypoint at the beginning of the array
      path = path.concat([ start ])
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

module.exports = Graph
