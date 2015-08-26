'use strict'

class PriorityQueue {

  /**
   * Creates a new queue:
   */
  constructor () {
    this._keys = new Set()
    this._queue = []
  }

  /**
   * Sort the queue to oderd them based on the priority
   *
   * @private
   */
  _sort () {
    this._queue.sort(function (a, b) {
      return a.priority - b.priority
    })
  }

  /**
   * Add or update the priority of a key
   *
   * @param {any}    key      - Key to insert
   * @param {number} priority - Priority of the key
   *
   * @return {nunber} Size of the queue
   */
  set (key, priority) {
    priority = Number(priority)
    if (isNaN(priority)) {
      throw new TypeError('"priority" must be a valid number')
    }

    if (!this._keys.has(key)) {
      // If the `_keys` set does not have this key, we are inserting a new one
      this._keys.add(key)
      this._queue.push({ key, priority })
    } else {
      // Update the priority of an existing key
      this._queue.map(function (element) {
        if (element.key === key) {
          element.priority = priority
        }

        return element
      })
    }

    this._sort()

    return this._queue.length
  }

  /**
   * Remove the first element from the priority queue and returns it
   *
   * @return {object} The object as of the priority queue
   */
  next () {
    const element = this._queue.shift()

    // Remove the key from the `_keys` set
    this._keys.delete(element.key)

    return element
  }

  /**
   * Return true if the queue is empty
   *
   * @return {boolean}
   */
  isEmpty () {
    return Boolean(!this._queue.length)
  }

  /**
   * Returns true if the queue contains the specified key
   *
   * @param {any} key - Key to check
   * @return {boolean}
   */
  has (key) {
    return this._keys.has(key)
  }

  get (key) {
    let result
    this._queue.forEach(function (element) {
      if (element.key === key) result = element
    })

    return result
  }

}

module.exports = PriorityQueue
