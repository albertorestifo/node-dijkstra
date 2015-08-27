/* global describe, it */
'use strict'

require('must')
const demand = require('must')

const populateMap = require('../libs/populateMap')

describe('populateMap()', function () {

  it('transforms a one level object', function () {
    var map = new Map()
    var obj = { example: 1 }

    populateMap(map, obj, Object.keys(obj))

    map.size.must.equal(1)
    map.get('example').must.equal(1)
  })

  it('transforms a two level object', function () {
    var map = new Map()
    var obj = {
      a: { b: 1 }
    }

    populateMap(map, obj, Object.keys(obj))

    map.size.must.equal(1)
    map.get('a').must.be.instanceOf(Map)
    map.get('a').get('b').must.equal(1)
  })

  it('transforms a three level object', function () {
    var map = new Map()
    var obj = {
      a: {
        b: { c: 1 }
      }
    }

    populateMap(map, obj, Object.keys(obj))

    map.size.must.equal(1)
    map.get('a').must.be.instanceOf(Map)
    map.get('a').get('b').must.be.instanceOf(Map)
    map.get('a').get('b').get('c').must.equal(1)
  })

  it('transforms a four level object', function () {
    var map = new Map()
    var obj = {
      a: {
        b: {
          c: { d: 1 }
        }
      }
    }

    populateMap(map, obj, Object.keys(obj))

    map.size.must.equal(1)
    map.get('a').must.be.instanceOf(Map)
    map.get('a').get('b').get('c').must.be.instanceOf(Map)
    map.get('a').get('b').get('c').get('d').must.equal(1)
  })

  it('rejects non-number values', function () {
    var map = new Map()
    var obj = { example: null }

    demand(populateMap.bind(this, map, obj, Object.keys(obj)))
      .to.throw(TypeError, /must be a number/)
  })

  it('rejects negative values', function () {
    var map = new Map()
    var obj = { example: -3 }

    demand(populateMap.bind(this, map, obj, Object.keys(obj)))
      .to.throw(TypeError, /number above 0/)
  })

  it('rejects 0', function () {
    var map = new Map()
    var obj = { example: 0 }

    demand(populateMap.bind(this, map, obj, Object.keys(obj)))
      .to.throw(TypeError, /number above 0/)
  })

  it('accepts 0.02', function () {
    var map = new Map()
    var obj = { example: 0.02 }

    populateMap(map, obj, Object.keys(obj))

    map.size.must.equal(1)
    map.get('example').must.equal(0.02)
  })

  it('accepts a string reppreseting a number', function () {
    var map = new Map()
    var obj = { example: '4' }

    populateMap(map, obj, Object.keys(obj))

    map.size.must.equal(1)
    map.get('example').must.equal(4)
  })

})
