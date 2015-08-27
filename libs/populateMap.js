'use strict'

/**
 * Assert that the cost is a positive number
 *
 * @private
 * @param {number} cost - The cost to validate
 * @return {number}
 */
function validateNode (cost) {
  let _cost = Number(cost)

  if (isNaN(_cost)) {
    throw new TypeError(`Cost must be a number, istead got ${cost}`)
  }

  if (_cost <= 0) {
    throw new TypeError(`The cost must be a number above 0, instead got ${cost}`)
  }

  return _cost
}

/**
 * Populate a map with the values of an object with nested maps
 *
 * @param {Map}    map    - Map to populate
 * @param {object} object - Object to use for the population
 * @param {array}  keys   - Array of keys of the object
 *
 * @return {Map} Populated map
 */
function populateMap (map, object, keys) {
  // Return the map once all the keys have been populated
  if (!keys.length) return map

  let key = keys.shift()
  let value = object[key]

  if (value !== null && typeof value === 'object') {
    // When value is an object, we transform every key of it into a map
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
