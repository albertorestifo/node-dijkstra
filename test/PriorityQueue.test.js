/* eslint-env node, mocha */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

require('must');
const demand = require('must');
const sinon = require('sinon');

const Queue = require('../libs/PriorityQueue');

describe('PriorityQueue', () => {
  describe('#constructor', () => {
    it('starts an empty queue and keys set', () => {
      const queue = new Queue();

      queue.keys.must.be.instanceOf(Set);
      queue.queue.must.be.an.array();
    });
  });

  describe('#sort()', () => {
    it('sorts by having the smallest first', () => {
      const queue = new Queue();
      queue.queue = [
        { priority: 10 },
        { priority: 1 },
      ];

      queue.sort();
      queue.queue[0].priority.must.equal(1);
    });
  });

  describe('#set()', () => {
    it('only accept numbers as priority values', () => {
      const queue = new Queue();

      demand(queue.set.bind(queue, 'key', {}))
        .throw(TypeError, /number/);
    });

    it('adds an unexisting key to the queue and reorders it', () => {
      const queue = new Queue();
      sinon.spy(queue, 'sort');

      queue.set('ok', 1);

      sinon.assert.calledOnce(queue.sort);
      queue.keys.size.must.equal(1);
      queue.queue.must.have.length(1);
      queue.queue[0].key.must.equal('ok');
      queue.queue[0].priority.must.equal(1);
    });

    it('updates the value of an existing key', () => {
      const queue = new Queue();
      sinon.spy(queue, 'sort');

      queue.set('ok', 1);
      queue.set('ok', 5);

      sinon.assert.calledTwice(queue.sort);
      queue.keys.size.must.equal(1);
      queue.queue.must.have.length(1);
      queue.queue[0].key.must.equal('ok');
      queue.queue[0].priority.must.equal(5);
    });
  });

  describe('#next()', () => {
    it('removes the first element in the queue', () => {
      const queue = new Queue();
      queue.set('ok', 10);
      queue.set('not-ok', 1);

      queue.next();

      queue.queue.must.have.length(1);
      queue.keys.size.must.equal(1);
    });

    it('return the first element in the queue', () => {
      const queue = new Queue();
      queue.set('ok', 10);
      queue.set('not-ok', 1);

      const el = queue.next();

      el.must.have.keys(['priority', 'key']);
      el.priority.must.equal(1);
      el.key.must.equal('not-ok');
    });
  });

  describe('#isEmpty()', () => {
    it('returns false when there are elements in the queue', () => {
      const queue = new Queue();
      queue.set('ok', 3);

      queue.isEmpty().must.be.false();
    });

    it('returns true when the queue is empty', () => {
      const queue = new Queue();

      queue.isEmpty().must.be.true();
    });
  });

  describe('#has()', () => {
    it('returns false when the key does not exist', () => {
      const queue = new Queue();
      queue.set('not-ok', 3);

      queue.has('ok').must.be.false();
    });

    it('returns false when the key does not exist', () => {
      const queue = new Queue();
      queue.set('not-ok', 3);

      queue.has('ok').must.be.false();
    });
  });

  describe('#get()', () => {
    it('gets the entry with the provided key', () => {
      const queue = new Queue();
      queue.set('ok', 3);

      const res = queue.get('ok');
      res.must.have.keys(['key', 'priority']);
      res.key.must.equal('ok');
      res.priority.must.equal(3);
    });
  });
});
