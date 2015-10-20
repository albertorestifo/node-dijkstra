/* global describe, it */
'use strict'

require('must')
const demand = require('must')
const sinon = require('sinon')

const Queue = require('../libs/PriorityQueue')

describe('PriorityQueue', function () {
  describe('#constructor', function () {
    it('starts an empty queue and keys set', function () {
      let queue = new Queue()

      queue._keys.must.be.instanceOf(Set)
      queue._queue.must.be.an.array()
    })
  })

  describe('#_sort()', function () {
    it('sorts by having the smallest first', function () {
      let queue = new Queue()
      queue._queue = [
        { priority: 10 },
        { priority: 1 }
      ]

      queue._sort()
      queue._queue[0].priority.must.equal(1)
    })
  })

  describe('#set()', function () {
    it('only accept numbers as priority values', function () {
      let queue = new Queue()

      demand(queue.set.bind(queue, 'key', {}))
        .throw(TypeError, /number/)
    })

    it('adds an unexisting key to the queue and reorders it', function () {
      let queue = new Queue()
      sinon.spy(queue, '_sort')

      queue.set('ok', 1)

      sinon.assert.calledOnce(queue._sort)
      queue._keys.size.must.equal(1)
      queue._queue.must.have.length(1)
      queue._queue[0].key.must.equal('ok')
      queue._queue[0].priority.must.equal(1)
    })

    it('updates the value of an existing key', function () {
      let queue = new Queue()
      sinon.spy(queue, '_sort')

      queue.set('ok', 1)
      queue.set('ok', 5)

      sinon.assert.calledTwice(queue._sort)
      queue._keys.size.must.equal(1)
      queue._queue.must.have.length(1)
      queue._queue[0].key.must.equal('ok')
      queue._queue[0].priority.must.equal(5)
    })
  })

  describe('#next()', function () {
    it('removes the first element in the queue', function () {
      let queue = new Queue()
      queue.set('ok', 10)
      queue.set('not-ok', 1)

      queue.next()

      queue._queue.must.have.length(1)
      queue._keys.size.must.equal(1)
    })

    it('return the first element in the queue', function () {
      let queue = new Queue()
      queue.set('ok', 10)
      queue.set('not-ok', 1)

      let el = queue.next()

      el.must.have.keys([ 'priority', 'key' ])
      el.priority.must.equal(1)
      el.key.must.equal('not-ok')
    })
  })

  describe('#isEmpty()', function () {
    it('returns false when there are elements in the queue', function () {
      let queue = new Queue()
      queue.set('ok', 3)

      queue.isEmpty().must.be.false()
    })

    it('returns true when the queue is empty', function () {
      let queue = new Queue()

      queue.isEmpty().must.be.true()
    })
  })

  describe('#has()', function () {
    it('returns false when the key does not exist', function () {
      let queue = new Queue()
      queue.set('not-ok', 3)

      queue.has('ok').must.be.false()
    })

    it('returns false when the key does not exist', function () {
      let queue = new Queue()
      queue.set('not-ok', 3)

      queue.has('ok').must.be.false()
    })
  })

  describe('#get()', function () {
    it('gets the entry with the provided key', function () {
      let queue = new Queue()
      queue.set('ok', 3)

      let res = queue.get('ok')
      res.must.have.keys([ 'key', 'priority' ])
      res.key.must.equal('ok')
      res.priority.must.equal(3)
    })
  })
})
