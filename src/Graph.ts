import { PriorityQueue } from './PriorityQueue';
import { removeDeepFromMap } from './removeDeepFromMap';
import { toDeepMap, GraphNode } from './toDeepMap';
import { validateDeep } from './validateDeep';

/**
 * Options for path finding
 */
export interface PathOptions {
  /** Exclude the origin and destination nodes from the result */
  trim?: boolean;
  /** Return the path in reversed order */
  reverse?: boolean;
  /** Also return the cost of the path when set to true */
  cost?: boolean;
  /** Nodes to be avoided */
  avoid?: (string | number)[];
}

/**
 * Result when cost option is enabled
 */
export interface PathResult {
  path: (string | number)[] | null;
  cost: number;
}

/**
 * Graph representation as an object
 */
export type GraphData = Record<string, Record<string, number>>;

/**
 * Graph representation as a Map
 */
export type GraphMap = Map<string | number, GraphNode>;

/**
 * Creates and manages a graph
 */
export class Graph {
  private graph: GraphMap;

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
   * @example
   * ```typescript
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
   * ```
   */
  constructor(graph?: GraphData | GraphMap) {
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
   * @example
   * ```typescript
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
   * ```
   */
  addNode(
    name: string | number,
    neighbors: Record<string, number> | Map<string | number, number>
  ): this {
    if (neighbors instanceof Map) {
      validateDeep(neighbors);
      this.graph.set(name, neighbors);
    } else {
      // Convert object to Map<string|number, number>
      const neighborMap = new Map<string | number, number>();
      Object.entries(neighbors).forEach(([key, value]) => {
        neighborMap.set(key, value);
      });
      this.graph.set(name, neighborMap);
    }

    return this;
  }

  /**
   * @deprecated since version 2.0, use `Graph#addNode` instead
   */
  addVertex(
    name: string | number,
    neighbors: Record<string, number> | Map<string | number, number>
  ): this {
    return this.addNode(name, neighbors);
  }

  /**
   * Removes a node and all of its references from the graph
   *
   * @example
   * ```typescript
   * const route = new Graph({
   *   A: { B: 1, C: 5 },
   *   B: { A: 3 },
   *   C: { B: 2, A: 2 },
   * });
   *
   * route.removeNode('C');
   * // The graph now is:
   * // { A: { B: 1 }, B: { A: 3 } }
   * ```
   */
  removeNode(key: string | number): this {
    this.graph = removeDeepFromMap(this.graph, key);

    return this;
  }

  /**
   * Compute the shortest path between the specified nodes
   *
   * @param start - Starting node
   * @param goal - Node we want to reach
   * @param options - Options
   * @returns Computed path between the nodes.
   *
   *  When `option.cost` is set to true, the returned value will be an object with shape:
   *    - `path` *(Array)*: Computed path between the nodes
   *    - `cost` *(Number)*: Cost of the path
   *
   * @example
   * ```typescript
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
   * ```
   */
  path(start: string | number, goal: string | number): (string | number)[] | null;
  path(
    start: string | number,
    goal: string | number,
    options: PathOptions & { cost: true }
  ): PathResult;
  path(
    start: string | number,
    goal: string | number,
    options: PathOptions
  ): (string | number)[] | null;
  path(
    start: string | number,
    goal: string | number,
    options: PathOptions = {}
  ): (string | number)[] | null | PathResult {
    // Don't run when we don't have nodes set
    if (!this.graph.size) {
      if (options.cost) return { path: null, cost: 0 };

      return null;
    }

    const explored = new Set<string | number>();
    const frontier = new PriorityQueue<string | number>();
    const previous = new Map<string | number, string | number>();

    let path: (string | number)[] = [];
    let totalCost = 0;

    const avoid: (string | number)[] = options.avoid ? [...options.avoid] : [];

    if (avoid.includes(start)) {
      throw new Error(`Starting node (${start}) cannot be avoided`);
    } else if (avoid.includes(goal)) {
      throw new Error(`Ending node (${goal}) cannot be avoided`);
    }

    // Add the starting point to the frontier, it will be the first node visited
    frontier.set(start, 0);

    // Run until we have visited every node in the frontier
    while (!frontier.isEmpty()) {
      // Get the node in the frontier with the lowest cost (`priority`)
      const node = frontier.next();

      // When the node with the lowest cost in the frontier in our goal node,
      // we can compute the path and exit the loop
      if (node.key === goal) {
        // Set the total cost to the current value
        totalCost = node.priority;

        let nodeKey = node.key;
        while (previous.has(nodeKey)) {
          path.push(nodeKey);
          nodeKey = previous.get(nodeKey)!;
        }

        break;
      }

      // Add the current node to the explored set
      explored.add(node.key);

      // Loop all the neighboring nodes
      const neighbors = this.graph.get(node.key) as Map<string | number, number> || new Map();
      neighbors.forEach((nCost, nNode) => {
        // If we already explored the node, or the node is to be avoided, skip it
        if (explored.has(nNode) || avoid.includes(nNode)) return;

        // If the neighboring node is not yet in the frontier, we add it with
        // the correct cost
        if (!frontier.has(nNode)) {
          previous.set(nNode, node.key);
          frontier.set(nNode, node.priority + nCost);
          return;
        }

        const frontierEntry = frontier.get(nNode);
        if (!frontierEntry) return;
        
        const frontierPriority = frontierEntry.priority;
        const nodeCost = node.priority + nCost;

        // Otherwise we only update the cost of this node in the frontier when
        // it's below what's currently set
        if (nodeCost < frontierPriority) {
          previous.set(nNode, node.key);
          frontier.set(nNode, nodeCost);
        }
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
  shortestPath(
    start: string | number,
    goal: string | number,
    options?: PathOptions
  ): (string | number)[] | null | PathResult {
    return this.path(start, goal, options as any);
  }
}

export default Graph;