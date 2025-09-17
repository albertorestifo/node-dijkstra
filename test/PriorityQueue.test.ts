import 'mocha';
import 'must';
const demand = require('must');
const sinon = require('sinon');

import { PriorityQueue } from '../src/PriorityQueue';

describe('PriorityQueue', () => {
  describe('#constructor', () => {
    it('starts an empty queue and keys set', () => {
      const queue = new PriorityQueue();

      (queue as any).keys.must.be.instanceOf(Set);
      (queue as any).queue.must.be.an.array();
    });
  });

  describe('#set()', () => {
    it('only accept numbers as priority values', () => {
      const queue = new PriorityQueue();

      demand(queue.set.bind(queue, 'key', {} as any)).throw(TypeError, /number/);
    });

    it('adds an unexisting key to the queue and reorders it', () => {
      const queue = new PriorityQueue();
      sinon.spy(queue as any, 'sort');

      queue.set('ok', 1);

      sinon.assert.calledOnce((queue as any).sort);
      (queue as any).keys.size.must.equal(1);
      (queue as any).queue.must.have.length(1);
      (queue as any).queue[0].key.must.equal('ok');
      (queue as any).queue[0].priority.must.equal(1);
    });

    it('updates the value of an existing key', () => {
      const queue = new PriorityQueue();
      sinon.spy(queue as any, 'sort');

      queue.set('ok', 1);
      queue.set('ok', 5);

      sinon.assert.calledTwice((queue as any).sort);
      (queue as any).keys.size.must.equal(1);
      (queue as any).queue.must.have.length(1);
      (queue as any).queue[0].key.must.equal('ok');
      (queue as any).queue[0].priority.must.equal(5);
    });
  });

  describe('#next()', () => {
    it('removes the first element in the queue', () => {
      const queue = new PriorityQueue();
      queue.set('ok', 10);
      queue.set('not-ok', 1);

      queue.next();

      (queue as any).queue.must.have.length(1);
      (queue as any).keys.size.must.equal(1);
    });

    it('return the first element in the queue', () => {
      const queue = new PriorityQueue();
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
      const queue = new PriorityQueue();
      queue.set('ok', 3);

      queue.isEmpty().must.be.false();
    });

    it('returns true when the queue is empty', () => {
      const queue = new PriorityQueue();

      queue.isEmpty().must.be.true();
    });
  });

  describe('#has()', () => {
    it('returns false when the key does not exist', () => {
      const queue = new PriorityQueue();

      queue.has('test').must.be.false();
    });

    it('returns true when the key exists', () => {
      const queue = new PriorityQueue();
      queue.set('test', 1);

      queue.has('test').must.be.true();
    });
  });

  describe('#get()', () => {
    it('gets the entry with the provided key', () => {
      const queue = new PriorityQueue();
      queue.set('test', 5);

      const entry = queue.get('test');
      entry!.key.must.equal('test');
      entry!.priority.must.equal(5);
    });
  });
});