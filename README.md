[![Build Status](https://travis-ci.org/albertorestifo/node-dijkstra.svg)](https://travis-ci.org/albertorestifo/node-dijkstra) [![Coverage Status](https://coveralls.io/repos/albertorestifo/node-dijkstra/badge.svg)](https://coveralls.io/r/albertorestifo/node-dijkstra) [![Dependency Status](https://gemnasium.com/albertorestifo/node-dijkstra.svg)](https://gemnasium.com/albertorestifo/node-dijkstra) [![Code Climate](https://codeclimate.com/github/albertorestifo/node-dijkstra/badges/gpa.svg)](https://codeclimate.com/github/albertorestifo/node-dijkstra) [![NPM](https://img.shields.io/npm/v/node-dijkstra.svg)](https://www.npmjs.com/package/node-dijkstra)

# node-dijkstra

A NodeJS (or io.js) implementation of the Dijkstra's shortest path problem.

## Installation

```shell
npm install node-dijkstra --save
```

## Usage

Basic example:

```js
var Graph = require('node-dijkstras');

var g = new Graph();

g.addVertex('A', {B:1});
g.addVertex('B', {A:1, C:2, D: 4});
g.addVertex('C', {B:2, D:1});
g.addVertex('D', {C:1, B:4});

console.log(g.shortestPath('A', 'D')); // => ['A', 'B', 'C', 'D']
```

## API

### `Graph([vertices])`

**Parameters:**

- `verticies` (optional): An object containing a vertices graph.

```js
var g = new Graph();
// or
var g = new Graph({
  A: {B: 1, C: 2},
  B: {A: 1}
})
```



### `Graph.prototype.addVertex(name, edges)`

**Parameters:**

- `name`: name of the vertex
- `edges`: object containing the connected vertices and the cost

**Returns:** `this`

```js
var g = new Graph();

g.addVertex('A', {B:1});

// you can chain the calls
g.addVertex('B', {A:1}).addVertex('C', {A:3});
```



### `Graph.prototype.shortestPath(start, finish [, options])`

**Parameters:**

- `start`: name of the starting vertex
- `finish`: name of the end vertex
- `options`: optional options object

**Returns:**

`Array` containing the crossed vertices names, in order from the starting vertex to the finish vertex, by default it includes the start and finish vertices as well. Returns `null` if no path can be found between the start and finish vertices.

**Options:**

- `trim` (default: `false`): if set to true, it won't include the starting and finish vertices in the returned path.
- `reverse` (default: `false`): if set to true, it will return the array vertices in reversed order

```js
var Graph = require('node-dijkstras');

var g = new Graph();

g.addVertex('A', {B:1});
g.addVertex('B', {A:1, C:2, D: 4});
g.addVertex('C', {B:2, D:1});
g.addVertex('D', {C:1, B:4});

g.shortestPath('A', 'D'); // => ['A', 'B', 'C', 'D']

// trimmed
g.shortestPath('A', 'D', {trim: true}); // => [B', 'C']

// reversed
g.shortestPath('A', 'D', {reverse: true}); // => ['D', 'C', 'B', 'A']

// reversed and trimmed
g.shortestPath('A', 'D', {
  reverse: true,
  trim: true
}); // => ['C', 'B']
```



## Testing

```shell
npm test
```


[1]: https://github.com/andrewhayward/dijkstra
