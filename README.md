[![Build Status](https://travis-ci.org/albertorestifo/node-dijkstra.svg)](https://travis-ci.org/albertorestifo/node-dijkstra) [![Coverage Status](https://coveralls.io/repos/albertorestifo/node-dijkstra/badge.svg)](https://coveralls.io/r/albertorestifo/node-dijkstra) [![Dependency Status](https://gemnasium.com/albertorestifo/node-dijkstra.svg)](https://gemnasium.com/albertorestifo/node-dijkstra) [![Code Climate](https://codeclimate.com/github/albertorestifo/node-dijkstra/badges/gpa.svg)](https://codeclimate.com/github/albertorestifo/node-dijkstra)

# node-dijkstra

A NodeJS (or io.js) implementation of the Dijkstra's shortest path problem.

## Installation

```shell
npm install node-dijkstra --save
```

## Usage

```js
var g = new Graph();

g.addVertex('A', {B: 7, C: 8});
g.addVertex('B', {A: 7, F: 2});
g.addVertex('C', {A: 8, F: 6, G: 4});
g.addVertex('D', {F: 8});
g.addVertex('E', {H: 1});
g.addVertex('F', {B: 2, C: 6, D: 8, G: 9, H: 3});
g.addVertex('G', {C: 4, F: 9});
```

## Testing

```shell
npm test
```


[1]: https://github.com/andrewhayward/dijkstra
