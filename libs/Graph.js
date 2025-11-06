const Queue = require("./PriorityQueue");
const removeDeepFromMap = require("./removeDeepFromMap");
const toDeepMap = require("./toDeepMap");
const validateDeep = require("./validateDeep");

/** Creates and manages a graph */
class Graph {
  /**
   * Creates a new Graph, optionally initializing it a nodes graph representation.
   *
   * A graph representation is an object that has as keys the name of the point and as values
   * the points reacheable from that node, with the cost to get there:
   *
   *     {
   *       node (Number|String): {
   *         neighbor (Number|String): cost (Number),
   *         ...,
   *       },
   *     }
   *
   * In alternative to an object, you can pass a `Map` of `Map`. This will
   * allow you to specify numbers as keys.
   *
   * @param {Objec|Map} [graph] - Initial graph definition
   * @example
   *
   * const route = new Graph();
   *
   * // Pre-populated graph
   * const route = new Graph({
   *   A: { B: 1 },
   *   B: { A: 1, C: 2, D: 4 },
   * });
   *
   * // Passing a Map
   * const g = new Map()
   *
   * const a = new Map()
   * a.set('B', 1)
   *
   * const b = new Map()
   * b.set('A', 1)
   * b.set('C', 2)
   * b.set('D', 4)
   *
   * g.set('A', a)
   * g.set('B', b)
   *
   * const route = new Graph(g)
   */
  constructor(graph) {
    if (graph instanceof Map) {
      validateDeep(graph);
      this.graph = graph;
    } else if (graph) {
      this.graph = toDeepMap(graph);
    } else {
      this.graph = new Map();
    }
  }

  /**
   * Adds a node to the graph
   *
   * @param {string} name      - Name of the node
   * @param {Object|Map} neighbors - Neighbouring nodes and cost to reach them
   * @return {this}
   * @example
   *
   * const route = new Graph();
   *
   * route.addNode('A', { B: 1 });
   *
   * // It's possible to chain the calls
   * route
   *   .addNode('B', { A: 1 })
   *   .addNode('C', { A: 3 });
   *
   * // The neighbors can be expressed in a Map
   * const d = new Map()
   * d.set('A', 2)
   * d.set('B', 8)
   *
   * route.addNode('D', d)
   */
  addNode(name, neighbors) {
    let nodes;
    if (neighbors instanceof Map) {
      validateDeep(neighbors);
      nodes = neighbors;
    } else {
      nodes = toDeepMap(neighbors);
    }

    this.graph.set(name, nodes);

    return this;
  }

  /**
   * @deprecated since version 2.0, use `Graph#addNode` instead
   */
  addVertex(name, neighbors) {
    return this.addNode(name, neighbors);
  }

  /**
   * Removes a node and all of its references from the graph
   *
   * @param {string|number} key - Key of the node to remove from the graph
   * @return {this}
   * @example
   *
   * const route = new Graph({
   *   A: { B: 1, C: 5 },
   *   B: { A: 3 },
   *   C: { B: 2, A: 2 },
   * });
   *
   * route.removeNode('C');
   * // The graph now is:
   * // { A: { B: 1 }, B: { A: 3 } }
   */
  removeNode(key) {
    this.graph = removeDeepFromMap(this.graph, key);

    return this;
  }

  /**
   * Compute the shortest path between the specified nodes
   *
   * @param {string}  start     - Starting node
   * @param {string}  goal      - Node we want to reach
   * @param {object}  [options] - Options
   *
   * @param {boolean} [options.trim]      - Exclude the origin and destination nodes from the result
   * @param {boolean} [options.reverse]   - Return the path in reversed order
   * @param {boolean} [options.cost]      - Also return the cost of the path when set to true
   * @param {number}  [options.maxCost]   - Only consider paths with total cost less than or equal to this value
   * @param {number}  [options.maxNodes]  - Maximum number of nodes allowed in the resulting path (including start and goal)
   * @param {function} [options.canVisit] - A predicate invoked for each potential edge expansion. Receives an object { from, to, cost, accumulatedCost, depth } and must return true to allow the move
   *
   * @return {array|object} Computed path between the nodes.
   *
   *  When `option.cost` is set to true, the returned value will be an object with shape:
   *    - `path` *(Array)*: Computed path between the nodes
   *    - `cost` *(Number)*: Cost of the path
   *
   * @example
   *
   * const route = new Graph()
   *
   * route.addNode('A', { B: 1 })
   * route.addNode('B', { A: 1, C: 2, D: 4 })
   * route.addNode('C', { B: 2, D: 1 })
   * route.addNode('D', { C: 1, B: 4 })
   *
   * route.path('A', 'D') // => ['A', 'B', 'C', 'D']
   *
   * // trimmed
   * route.path('A', 'D', { trim: true }) // => [B', 'C']
   *
   * // reversed
   * route.path('A', 'D', { reverse: true }) // => ['D', 'C', 'B', 'A']
   *
   * // include the cost
   * route.path('A', 'D', { cost: true })
   * // => {
   * //       path: [ 'A', 'B', 'C', 'D' ],
   * //       cost: 4
   * //    }
   */
  path(start, goal, options = {}) {
    // Don't run when we don't have nodes set
    if (!this.graph.size) {
      if (options.cost) return { path: null, cost: 0 };

      return null;
    }

    const explored = new Set();
    const frontier = new Queue();
    const previous = new Map();
    const depth = new Map();

    let path = [];
    let totalCost = 0;

    let avoid = [];
    if (options.avoid) avoid = [].concat(options.avoid);

    if (avoid.includes(start)) {
      throw new Error(`Starting node (${start}) cannot be avoided`);
    } else if (avoid.includes(goal)) {
      throw new Error(`Ending node (${goal}) cannot be avoided`);
    }

    const hasMaxCost =
      typeof options.maxCost === "number" && !Number.isNaN(options.maxCost);
    const maxCost = hasMaxCost ? Number(options.maxCost) : undefined;
    const hasMaxNodes =
      typeof options.maxNodes === "number" && !Number.isNaN(options.maxNodes);
    const maxNodes = hasMaxNodes
      ? Math.max(1, Math.floor(options.maxNodes))
      : undefined;
    const canVisit = typeof options.canVisit === "function" ? options.canVisit : null;

    // Add the starting point to the frontier, it will be the first node visited
    frontier.set(start, 0);
    depth.set(start, 1);

    // Run until we have visited every node in the frontier
    while (!frontier.isEmpty()) {
      // Get the node in the frontier with the lowest cost (`priority`)
      const node = frontier.next();

      // If the cheapest node already exceeds maxCost, no valid path can be found
      if (hasMaxCost && node.priority > maxCost) {
        // ensure path remains empty so we return null later
        path = [];
        break;
      }

      // When the node with the lowest cost in the frontier in our goal node,
      // we can compute the path and exit the loop
      if (node.key === goal) {
        // Set the total cost to the current value
        totalCost = node.priority;

        let nodeKey = node.key;
        while (previous.has(nodeKey)) {
          path.push(nodeKey);
          nodeKey = previous.get(nodeKey);
        }

        break;
      }

      // Add the current node to the explored set
      explored.add(node.key);

      // Loop all the neighboring nodes
      const neighbors = this.graph.get(node.key) || new Map();
      neighbors.forEach((nCost, nNode) => {
        // If we already explored the node, or the node is to be avoided, skip it
        if (explored.has(nNode) || avoid.includes(nNode)) return null;

        const newCost = node.priority + nCost;
        const currentDepth = depth.get(node.key) || 1;
        const newDepth = currentDepth + 1;

        // Enforce maximum number of nodes in the resulting path (including start and goal)
        if (hasMaxNodes && newDepth > maxNodes) return null;

        // Enforce maximum cost constraint
        if (hasMaxCost && newCost > maxCost) return null;

        // If provided, consult the canVisit to decide whether to expand this edge
        if (canVisit) {
          const allowed = canVisit({
            from: node.key,
            to: nNode,
            cost: nCost,
            accumulatedCost: newCost,
            depth: newDepth,
          });
          if (!allowed) return null;
        }

        // If the neighboring node is not yet in the frontier, we add it with
        // the correct cost
        if (!frontier.has(nNode)) {
          previous.set(nNode, node.key);
          depth.set(nNode, newDepth);
          return frontier.set(nNode, newCost);
        }

        const frontierPriority = frontier.get(nNode).priority;

        // Otherwise we only update the cost of this node in the frontier when
        // it's below what's currently set
        if (newCost < frontierPriority) {
          previous.set(nNode, node.key);
          depth.set(nNode, newDepth);
          return frontier.set(nNode, newCost);
        }

        return null;
      });
    }

    // Return null when no path can be found
    if (!path.length) {
      if (options.cost) return { path: null, cost: 0 };

      return null;
    }

    // From now on, keep in mind that `path` is populated in reverse order,
    // from destination to origin

    // Remove the first value (the goal node) if we want a trimmed result
    if (options.trim) {
      path.shift();
    } else {
      // Add the origin waypoint at the end of the array
      path = path.concat([start]);
    }

    // Reverse the path if we don't want it reversed, so the result will be
    // from `start` to `goal`
    if (!options.reverse) {
      path = path.reverse();
    }

    // Return an object if we also want the cost
    if (options.cost) {
      return {
        path,
        cost: totalCost,
      };
    }

    return path;
  }

  /**
   * @deprecated since version 2.0, use `Graph#path` instead
   */
  shortestPath(...args) {
    return this.path(...args);
  }
}

module.exports = Graph;
