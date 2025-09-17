# node-dijkstra

[![Unit Tests](https://github.com/albertorestifo/node-dijkstra/actions/workflows/test.yml/badge.svg)](https://github.com/albertorestifo/node-dijkstra/actions/workflows/test.yml) [![codecov.io](http://codecov.io/github/albertorestifo/node-dijkstra/coverage.svg?branch=master)](http://codecov.io/github/albertorestifo/node-dijkstra?branch=master)

> Fast TypeScript implementation of Dijkstra's shortest path algorithm for NodeJS

## Installation

Requires Node.js 16.0.0 or newer.

```shell
npm install node-dijkstra
```

## Usage

### TypeScript

```typescript
import { Graph } from 'node-dijkstra';

const route = new Graph();
route.addNode('A', { B: 1 });
route.addNode('B', { A: 1, C: 2, D: 4 });
route.addNode('C', { B: 2, D: 1 });
route.addNode('D', { C: 1, B: 4 });

route.path('A', 'D'); // => ['A', 'B', 'C', 'D']
```

### JavaScript

```javascript
const { Graph } = require('node-dijkstra');

const route = new Graph();
route.addNode('A', { B: 1 });
route.addNode('B', { A: 1, C: 2, D: 4 });
route.addNode('C', { B: 2, D: 1 });
route.addNode('D', { C: 1, B: 4 });

route.path('A', 'D'); // => ['A', 'B', 'C', 'D']
```

## API

### Types

```typescript
type NodeKey = string | number;
type EdgeWeight = number;
type GraphData = Record<string, Record<string, EdgeWeight>>;

interface PathOptions {
  trim?: boolean;
  reverse?: boolean;
  cost?: boolean;
  avoid?: NodeKey[];
}

interface PathResult {
  path: NodeKey[] | null;
  cost: EdgeWeight;
}
```

### Graph

#### `new Graph(nodes?: GraphData)`

Creates a new Graph instance with optional initial data.

#### `addNode(name: NodeKey, neighbors: Record<string, EdgeWeight>): this`

Adds a node with its neighbors and edge weights.

#### `removeNode(key: NodeKey): this`

Removes a node and all references to it.

#### `path(start: NodeKey, goal: NodeKey, options?: PathOptions): NodeKey[] | PathResult | null`

Finds the shortest path between two nodes. Returns `PathResult` when `options.cost` is true.

## License

MIT
