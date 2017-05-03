# node-dijkstra

[![Build Status](https://travis-ci.org/albertorestifo/node-dijkstra.svg?branch=harmony)](https://travis-ci.org/albertorestifo/node-dijkstra) [![codecov.io](http://codecov.io/github/albertorestifo/node-dijkstra/coverage.svg?branch=master)](http://codecov.io/github/albertorestifo/node-dijkstra?branch=master) [![Dependency Status](https://david-dm.org/albertorestifo/node-dijkstra.svg)](https://david-dm.org/albertorestifo/node-dijkstra)

> Fast JavaScript implementation of the  Dijkstra's shortest path problem for NodeJS

## Installation

Since version 2 this plugin uses some ES6 features. You can run the latest version on **NodeJS `v4.0.0` or newer**

```shell
npm install node-dijkstra --save
```

### NodeJS prior `v4.0.0`

On versions of NodeJS prior `v4.0.0`, although less performant, it's safe to use the version `1.1.3` that you can install as follows:

```shell
npm install node-dijkstra@1.1.3 --save
```

You can then refer to the [`v1.1.3` documentation](https://github.com/albertorestifo/node-dijkstra/blob/v1.1.3/README.md#api)

## Usage

Basic example:

```js
const Graph = require('node-dijkstra')

const route = new Graph()

route.addNode('A', { B:1 })
route.addNode('B', { A:1, C:2, D: 4 })
route.addNode('C', { B:2, D:1 })
route.addNode('D', { C:1, B:4 })

route.path('A', 'D') // => [ 'A', 'B', 'C', 'D' ]
```

## API

### `Graph([nodes])`

#### Parameters

- `Object|Map nodes` _optional_: Initial nodes graph.

A nodes graph must follow this structure:

```
{
  node: {
    neighbor: cost Number
  }
}
```

```js
{
  'A': {
    'B': 1
  },
  'B': {
    'A': 1,
    'C': 2,
    'D': 4
  }
}
```

#### Example

```js
const route = new Graph()

// or with pre-populated graph
const route = new Graph({
  'A': { 'B': 1 },
  'B': { 'A': 1, 'C': 2, 'D': 4 }
})
```

It's possible to pass the constructor a deep `Map`. This allows using numbers as keys for the nodes.

```js
const graph = new Map()

const a = new Map()
a.set('B', 1)

const b = new Map()
b.set('A', 1)
b.set('C', 2)
b.set('D', 4)

graph.set('A', a)
graph.set('B', b);

const route = new Graph(graph)
```


### `Graph#addNode(name, edges)`

Add a node to the nodes graph

#### Parameters

- `String name`: name of the node
- `Object|Map edges`: object or `Map` containing the name of the neighboring nodes and their cost

#### Returns

Returns `this` allowing chained calls.

```js
const route = new Graph()

route.addNode('A', { B: 1 })

// chaining is possible
route.addNode('B', { A: 1 }).addNode('C', { A: 3 });

// passing a Map directly is possible
const c = new Map()
c.set('A', 4)

route.addNode('C', c);
```


### `Graph#removeNode(name)`

Removes a node and all its references from the graph

#### Parameters

- `String name`: name of the node to remove

#### Returns

Returns `this` allowing chained calls.

```js
const route = new Graph({
  a: { b: 3, c: 10 },
  b: { a: 5, c: 2 },
  c: { b: 1 },
});

route.removeNode('c');
// => The graph now is:
// {
//   a: { b: 3 },
//   b: { a: 5 },
// }
```


### `Graph#path(start, goal [, options])`

#### Parameters

- `String start`: Name of the starting node
- `String goal`: Name of out goal node
- `Object options` _optional_: Addittional options:
  - `Boolean trim`, default `false`: If set to true, the result won't include the start and goal nodes
  - `Boolean reverse`, default `false`: If set to true, the result will be in reverse order, from goal to start
  - `Boolean cost`, default `false`: If set to true, an object will be returned with the following keys:
    - `Array path`: Computed path (subject to other options)
    - `Number cost`: Total cost for the found path
  - `Array avoid`, default `[]`: Nodes to be avoided

#### Returns

If `options.cost` is `false` (default behaviour) an `Array` will be returned, containing the name of the crossed nodes. By default it will be ordered from start to goal, and those nodes will also be included. This behaviour can be changes with `options.trim` and `options.reverse` (see above)

If `options.cost` is `true`, an `Object` with keys `path` and `cost` will be returned. `path` follows the same rules as above and `cost` is the total cost of the found route between nodes.

When to route can be found, the path will be set to `null`.

```js
const Graph = require('node-dijkstra')

const route = new Graph()

route.addNode('A', { B: 1 })
route.addNode('B', { A: 1, C: 2, D: 4 })
route.addNode('C', { B: 2, D: 1 })
route.addNode('D', { C: 1, B: 4 })

route.path('A', 'D') // => ['A', 'B', 'C', 'D']

// trimmed
route.path('A', 'D', { trim: true }) // => [B', 'C']

// reversed
route.path('A', 'D', { reverse: true }) // => ['D', 'C', 'B', 'A']

// include the cost
route.path('A', 'D', { cost: true })
// => {
//       path: [ 'A', 'B', 'C', 'D' ],
//       cost: 4
//    }
```


## Upgrading from `v1`

- The `v2` release in not compatible with NodeJS prior to the version 4.0
- The method `Graph#shortestPath` has been deprecated, use `Graph#path` instead
- The method `Graph#addVertex` has been deprecated, use `Graph#addNode` instead


## Testing

```shell
npm test
```

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)


[1]: https://github.com/andrewhayward/dijkstra
