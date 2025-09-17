# node-dijkstra

[![Unit Tests](https://github.com/albertorestifo/node-dijkstra/actions/workflows/test.yml/badge.svg)](https://github.com/albertorestifo/node-dijkstra/actions/workflows/test.yml) [![codecov.io](http://codecov.io/github/albertorestifo/node-dijkstra/coverage.svg?branch=master)](http://codecov.io/github/albertorestifo/node-dijkstra?branch=master)

> Fast TypeScript implementation of Dijkstra's shortest path algorithm for NodeJS

## Installation

**Version 3.0.0** is a complete rewrite in TypeScript with modern features. This version requires **NodeJS `v16.0.0` or newer**.

```shell
npm install node-dijkstra
```

### Previous Versions

For older Node.js versions:
- **v2.x**: NodeJS `v4.0.0` or newer
- **v1.1.3**: NodeJS prior to `v4.0.0`

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

### JavaScript (CommonJS)

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

### `new Graph([nodes])`

Creates a new Graph instance.

#### Parameters

- `nodes` _(Object|Map, optional)_: Initial nodes graph.

A nodes graph must follow this structure:

```typescript
{
  [node: string]: {
    [neighbor: string]: cost // number
  }
}
```

#### Example

```typescript
const route = new Graph();

// or with pre-populated graph
const route = new Graph({
  A: { B: 1 },
  B: { A: 1, C: 2, D: 4 },
});
```

You can also pass a `Map` for better performance and to use numbers as keys:

```typescript
const graph = new Map();

const a = new Map();
a.set('B', 1);

const b = new Map();
b.set('A', 1);
b.set('C', 2);
b.set('D', 4);

graph.set('A', a);
graph.set('B', b);

const route = new Graph(graph);
```

### `Graph#addNode(name, edges)`

Add a node to the graph.

#### Parameters

- `name` _(string|number)_: Name of the node
- `edges` _(Object|Map)_: Neighboring nodes and cost to reach them

#### Returns

Returns the Graph instance for method chaining.

#### Example

```typescript
const route = new Graph();

route.addNode('A', { B: 1 });

// Method chaining
route
  .addNode('B', { A: 1 })
  .addNode('C', { A: 3 });

// Using a Map
const d = new Map();
d.set('A', 2);
d.set('B', 8);
route.addNode('D', d);
```

### `Graph#removeNode(name)`

Remove a node and all of its references from the graph.

#### Parameters

- `name` _(string|number)_: Key of the node to remove

#### Returns

Returns the Graph instance for method chaining.

#### Example

```typescript
const route = new Graph({
  A: { B: 1, C: 5 },
  B: { A: 3 },
  C: { B: 2, A: 2 },
});

route.removeNode('C');
// The graph now is: { A: { B: 1 }, B: { A: 3 } }
```

### `Graph#path(start, goal [, options])`

Find the shortest path between two nodes.

#### Parameters

- `start` _(string|number)_: Name of the starting node
- `goal` _(string|number)_: Name of the destination node
- `options` _(Object, optional)_: Additional options:
  - `trim` _(boolean, default: false)_: If true, exclude start and goal nodes from the result
  - `reverse` _(boolean, default: false)_: If true, return path in reverse order (goal to start)
  - `cost` _(boolean, default: false)_: If true, return an object with path and cost
  - `avoid` _(Array, default: [])_: Array of nodes to avoid

#### Returns

- **Array**: When `options.cost` is `false`, returns an array of node names from start to goal
- **Object**: When `options.cost` is `true`, returns `{ path: Array, cost: number }`
- **null**: When no path exists

#### Example

```typescript
import { Graph } from 'node-dijkstra';

const route = new Graph();

route.addNode('A', { B: 1 });
route.addNode('B', { A: 1, C: 2, D: 4 });
route.addNode('C', { B: 2, D: 1 });
route.addNode('D', { C: 1, B: 4 });

route.path('A', 'D'); // => ['A', 'B', 'C', 'D']

// With options
route.path('A', 'D', { trim: true }); // => ['B', 'C']
route.path('A', 'D', { reverse: true }); // => ['D', 'C', 'B', 'A']
route.path('A', 'D', { cost: true });
// => { path: ['A', 'B', 'C', 'D'], cost: 4 }

// Avoid nodes
route.path('A', 'D', { avoid: ['B'] }); // => ['A', 'C', 'D']
```

## Breaking Changes in v3.0.0

- **TypeScript**: Complete rewrite in TypeScript with full type definitions
- **Node.js**: Requires Node.js v16.0.0 or newer
- **ES Modules**: Primary support for ES modules, CommonJS still supported
- **Import**: Use named import `{ Graph }` instead of default import
- **Types**: All parameters and return values are now strongly typed

### Migration from v2.x

```typescript
// v2.x
const Graph = require('node-dijkstra');

// v3.x TypeScript
import { Graph } from 'node-dijkstra';

// v3.x JavaScript
const { Graph } = require('node-dijkstra');
```

## Upgrading from v1.x

- The method `Graph#shortestPath` has been deprecated, use `Graph#path` instead
- The method `Graph#addVertex` has been deprecated, use `Graph#addNode` instead

## Testing

```shell
npm test
```

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
