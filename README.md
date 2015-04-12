[![Build Status](https://travis-ci.org/albertorestifo/node-dijkstra.svg)](https://travis-ci.org/albertorestifo/node-dijkstra)

# node-dijkstra

A NodeJS (or io.js) implementation of the Dijkstra's shortest path problem.

## Installation

```shell
npm install node-dijkstra --save
```

## Usage

```js
var map = {a:{b:3,c:1},b:{a:2,c:1},c:{a:4,b:1}},
    graph = new Graph(map);

graph.findShortestPath('a', 'b');      // => ['a', 'c', 'b']
graph.findShortestPath('a', 'c');      // => ['a', 'c']
graph.findShortestPath('b', 'a');      // => ['b', 'a']
graph.findShortestPath('b', 'c', 'b'); // => ['b', 'c', 'b']
graph.findShortestPath('c', 'a', 'b'); // => ['c', 'b', 'a', 'c', 'b']
graph.findShortestPath('c', 'b', 'a'); // => ['c', 'b', 'a']
```

## Testing

```shell
npm test
```


[1]: https://github.com/andrewhayward/dijkstra
