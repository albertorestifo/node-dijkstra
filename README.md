# node-dijkstra

[![Build Status](https://travis-ci.org/albertorestifo/node-dijkstra.svg?branch=harmony)](https://travis-ci.org/albertorestifo/node-dijkstra)

> Fast JavaScript implementation of the  Dijkstra's shortest path problem for iojs and NodeJS

**NodeJS users beware:** since version `2` of this plugin uses some incompatible ES6 faetures. The version `1.1.3` is stable and safe to use on NodeJS.

Install it with `npm install node-dijkstra@1.1.3 --save`

## Installation

Since version 2 this plugin uses some ES6 features. On iojs you can install the lastest version:

```shell
npm install node-dijkstra --save
```

### NodeJS 

On Node it's safe to use the version `1.1.3` that you can install as follows:

```shell
npm install node-dijkstra@1.1.3 --save
```

You can then refer to the [`v1.1.3` documentation](https://github.com/albertorestifo/node-dijkstra/blob/v1.1.3/README.md#api)

## Usage

Basic example:

```js
const Graph = require('node-dijkstras')

const route = new Graph()

route.addVertex('A', { B:1 })
route.addVertex('B', { A:1, C:2, D: 4 })
route.addVertex('C', { B:2, D:1 })
route.addVertex('D', { C:1, B:4 })

route.path('A', 'D') // => [ 'A', 'B', 'C', 'D' ]
```

## API

### `Graph([vertices])`

#### Parameters

- `Object verticies` _optional_: Initial vertices graph.

A vertices graph must follow this structure:

```
{
  vertex: {
    vertex: cost Number
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



### `Graph#addVertex(name, edges)`

Add a vertex to the vertices graph

#### Parameters

- `String name`: name of the vertex
- `Object edges`: object containing the name of the connected vertices as keys and as value the cost to the vertex

#### Returns

Returns `this` allowing chained calls.

```js
const route = new Graph()

route.addVertex('A', { B: 1 })

// cahining is possible
route.addVertex('B', { A: 1 }).addVertex('C', { A: 3 });
```



### `Graph#path(origin, destination [, options])`

#### Parameters

- `String origin`: Name of the origin vertex
- `String finish`: Name of the destination vertex
- `Object options` _optional_: Addittional options:
  - `Boolean trim`, deafult `false`: If set to true, the result won't include the origin and destination vertices
  - `Boolean reverse`, default `false`: If set to true, the result will be in reverse order, from destination to origin

#### Returns

`Array` containing the crossed vertices names, by default ordered from the origin to the destination vertex. Setting `options.reverse` to true will invert the result.

Returns `null` if no path can be found between the start and finish vertices.

By default, the array includes the origin and destination vertices. Setting `options.trim` to true will remove those.

```js
var Graph = require('node-dijkstras')

var route = new Graph()

route.addVertex('A', { B: 1 })
route.addVertex('B', { A: 1, C: 2, D: 4 })
route.addVertex('C', { B: 2, D: 1 })
route.addVertex('D', { C: 1, B: 4 })

route.path('A', 'D') // => ['A', 'B', 'C', 'D']

// trimmed
route.path('A', 'D', { trim: true }) // => [B', 'C']

// reversed
route.path('A', 'D', { reverse: true }) // => ['D', 'C', 'B', 'A']

// reversed and trimmed
route.path('A', 'D', {
  reverse: true,
  trim: true
}) // => ['C', 'B']
```

## Upgrading from `v1`

- The `v2` release in not compatible with NodeJS
- The method `shortestPath` has been renamed `path`, but an alias is provided so there is no need to update your code


## Testing

```shell
npm test
```

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)


[1]: https://github.com/andrewhayward/dijkstra
