'use strict'

/**
 * Assert that the provided cost in a positive number
 *
 * @private
 * @param {number} cost   Cost to validate
 * @return {number} cost
 */
function validateNode (cost) {
  cost = Number(cost)

  if (isNaN(cost)) {
    throw new TypeError(`Cost must be a number, istead got ${cost}`)
  }

  if (cost <= 0) {
    throw new TypeError(`The cost must be a number above 0, instead got ${cost}`)
  }

  return cost
}

/**
 * Populates the `Map` passed as first agument with the values in the provided
 * object. Supports nested objects, recursively adding them to a `Map`
 *
 * @param {Map}    map      `Map` to populate with the values from the object
 * @param {object} object   Object to translate into the `Map`
 * @param {array}  keys     Keys of the object to assign to the `Map`
 *
 * @return {Map} Populated `Map` with nested `Map`s
 */
function populateMap (map, object, keys) {
  // Return the map once all the keys have been populated
  if (!keys.length) return map

  let key = keys.shift()
  let value = object[key]

  if (value !== null && typeof value === 'object') {
    // When the key is an object, we recursevely populate its proprieties into
    // a new `Map`
    value = populateMap(new Map(), value, Object.keys(value))
  } else {
    // Ensure the node is a positive number
    value = validateNode(value)
  }

  // Set the value into the map
  map.set(key, value)

  // Recursive call
  return populateMap(map, object, keys)
}

module.exports = populateMap
