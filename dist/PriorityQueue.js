'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This very basic implementation of a priority queue is used to select the
 * next node of the graph to walk to.
 *
 * The queue is always sorted to have the least expensive node on top.
 * Some helper methods are also implemented.
 *
 * You should **never** modify the queue directly, but only using the methods
 * provided by the class.
 */
var PriorityQueue = function () {

  /**
   * Creates a new empty priority queue
   */
  function PriorityQueue() {
    _classCallCheck(this, PriorityQueue);

    // The `keys` set is used to greatly improve the speed at which we can
    // check the presence of a value in the queue
    this.keys = new Set();
    this.queue = [];
  }

  /**
   * Sort the queue to have the least expensive node to visit on top
   *
   * @private
   */


  _createClass(PriorityQueue, [{
    key: 'sort',
    value: function sort() {
      this.queue.sort(function (a, b) {
        return a.priority - b.priority;
      });
    }

    /**
     * Sets a priority for a key in the queue.
     * Inserts it in the queue if it does not already exists.
     *
     * @param {any}     key       Key to update or insert
     * @param {number}  value     Priority of the key
     * @return {number} Size of the queue
     */

  }, {
    key: 'set',
    value: function set(key, value) {
      var priority = Number(value);
      if (isNaN(priority)) throw new TypeError('"priority" must be a number');

      if (!this.keys.has(key)) {
        // Insert a new entry if the key is not already in the queue
        this.keys.add(key);
        this.queue.push({ key: key, priority: priority });
      } else {
        // Update the priority of an existing key
        this.queue.map(function (element) {
          if (element.key === key) {
            Object.assign(element, { priority: priority });
          }

          return element;
        });
      }

      this.sort();
      return this.queue.length;
    }

    /**
     * The next method is used to dequeue a key:
     * It removes the first element from the queue and returns it
     *
     * @return {object} First priority queue entry
     */

  }, {
    key: 'next',
    value: function next() {
      var element = this.queue.shift();

      // Remove the key from the `_keys` set
      this.keys.delete(element.key);

      return element;
    }

    /**
     * @return {boolean} `true` when the queue is empty
     */

  }, {
    key: 'isEmpty',
    value: function isEmpty() {
      return Boolean(this.queue.length === 0);
    }

    /**
     * Check if the queue has a key in it
     *
     * @param {any} key   Key to lookup
     * @return {boolean}
     */

  }, {
    key: 'has',
    value: function has(key) {
      return this.keys.has(key);
    }

    /**
     * Get the element in the queue with the specified key
     *
     * @param {any} key   Key to lookup
     * @return {object}
     */

  }, {
    key: 'get',
    value: function get(key) {
      return this.queue.find(function (element) {
        return element.key === key;
      });
    }
  }]);

  return PriorityQueue;
}();

module.exports = PriorityQueue;