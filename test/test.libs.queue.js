var expect = require('chai').expect;
var Queue = require('../libs/queue');
var sinon = require('sinon');

describe('PriorityQueue', function() {

  describe('constructor', function() {
    it('should correctly construct the object', function() {
      var queue = new Queue();

      expect(queue).to.respondTo('enqueue');
    });
  });

  describe('enqueue()', function() {

    it('should add the node to the queue', function() {
      var queue = new Queue();
      queue.enqueue(1, 'a');

      expect(queue.nodes).to.have.length(1);
      expect(queue.nodes[0]).to.contain.all.keys(['key', 'priority']);
    });

    it('should call the sorting function', function() {
      var queue = new Queue();
      sinon.spy(queue, 'sort');
      queue.enqueue(1, 'a');

      expect(queue.sort.calledOnce).to.be.true;
      queue.sort.restore();
    });

  }); // enqueue

  describe('dequeue()', function() {
    it('should remove the first element form the queue', function() {
      var queue = new Queue();
      queue.enqueue(1, 'a');
      queue.dequeue();

      expect(queue.nodes).to.have.length(0);
    });
  });

  describe('sort()', function() {
    it('should correctly sort the queue', function() {
      var queue = new Queue();
      queue.enqueue(2, 'a');
      queue.enqueue(1, 'a');
      queue.enqueue(10, 'a');

      expect(queue.nodes[0].priority).to.equal(1);
    });
  });

  describe('isEmpty()', function() {
    it('should return true when nodes are empty', function() {
      var queue = new Queue();

      expect(queue.isEmpty()).to.be.true;
    });

    it('should return false when nodes are not empty', function() {
      var queue = new Queue();
      queue.enqueue(2, 'a');

      expect(queue.isEmpty()).to.be.false;
    });
  });

});
