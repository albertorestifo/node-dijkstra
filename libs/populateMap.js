'use strict'

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

  if (typeof value === 'object') {
    // When value is an object, we transform every key of it into a map
    value = populateMap(new Map(), value, Object.keys(value))
  }

  // Set the value into the map
  map.set(key, value)

  // Recursive call
  return populateMap(map, object, keys)
}

module.exports = populateMap
