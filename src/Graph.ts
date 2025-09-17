import { PriorityQueue } from './PriorityQueue';
import { removeDeepFromMap } from './removeDeepFromMap';
import { toDeepMap } from './toDeepMap';
import { validateDeep } from './validateDeep';

export type NodeKey = string | number;
export type EdgeWeight = number;
export type GraphNode = number | Map<NodeKey, GraphNode>;

export interface PathOptions {
  /** Exclude the origin and destination nodes from the result */
  trim?: boolean;
  /** Return the path in reversed order, from goal to start */
  reverse?: boolean;
  /** Return an object with path and cost instead of just the path */
  cost?: boolean;
  /** Array of nodes to be avoided when finding the path */
  avoid?: NodeKey[];
}

export interface PathOptionsWithCost extends PathOptions {
  cost: true;
}

export interface PathResult {
  path: NodeKey[] | null;
  cost: EdgeWeight;
}

export type GraphData = Record<string, Record<string, EdgeWeight>>;
export type GraphMap = Map<NodeKey, GraphNode>;

export class Graph {
  private graph: GraphMap;

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

  addNode(name: NodeKey, neighbors: Record<string, EdgeWeight> | Map<NodeKey, EdgeWeight>): this {
    if (neighbors instanceof Map) {
      validateDeep(neighbors);
      this.graph.set(name, neighbors);
    } else {
      const neighborMap = new Map<NodeKey, EdgeWeight>();
      Object.entries(neighbors).forEach(([key, value]) => {
        neighborMap.set(key, value);
      });
      this.graph.set(name, neighborMap);
    }

    return this;
  }

  removeNode(key: NodeKey): this {
    this.graph = removeDeepFromMap(this.graph, key);
    return this;
  }

  path(start: NodeKey, goal: NodeKey, options: PathOptions = {}): NodeKey[] | PathResult | null {
    if (!this.graph.size) {
      if (options.cost) return { path: null, cost: 0 };
      return null;
    }

    const explored = new Set<NodeKey>();
    const frontier = new PriorityQueue<NodeKey>();
    const previous = new Map<NodeKey, NodeKey>();

    let path: NodeKey[] = [];
    let totalCost = 0;

    const avoid: NodeKey[] = options.avoid ? [...options.avoid] : [];

    if (avoid.includes(start)) {
      throw new Error(`Starting node (${start}) cannot be avoided`);
    } else if (avoid.includes(goal)) {
      throw new Error(`Ending node (${goal}) cannot be avoided`);
    }

    frontier.set(start, 0);

    while (!frontier.isEmpty()) {
      const node = frontier.next();

      if (node.key === goal) {
        totalCost = node.priority;

        let nodeKey = node.key;
        while (previous.has(nodeKey)) {
          path.push(nodeKey);
          nodeKey = previous.get(nodeKey)!;
        }

        break;
      }

      explored.add(node.key);

      const neighbors = this.graph.get(node.key) as Map<NodeKey, EdgeWeight> || new Map();
      neighbors.forEach((nCost, nNode) => {
        if (explored.has(nNode) || avoid.includes(nNode)) return;

        if (!frontier.has(nNode)) {
          previous.set(nNode, node.key);
          frontier.set(nNode, node.priority + nCost);
          return;
        }

        const frontierEntry = frontier.get(nNode);
        if (!frontierEntry) return;
        
        const frontierPriority = frontierEntry.priority;
        const nodeCost = node.priority + nCost;

        if (nodeCost < frontierPriority) {
          previous.set(nNode, node.key);
          frontier.set(nNode, nodeCost);
        }
      });
    }

    if (!path.length) {
      if (options.cost) return { path: null, cost: 0 };
      return null;
    }

    if (options.trim) {
      path.shift();
    } else {
      path = path.concat([start]);
    }

    if (!options.reverse) {
      path = path.reverse();
    }

    if (options.cost) {
      return { path, cost: totalCost };
    }

    return path;
  }
}

export default Graph;