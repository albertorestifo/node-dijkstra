/**
 * Validates a cost for a node
 *
 * @private
 * @param {number} val - Cost to validate
 * @return {bool}
 */
function isValidNode(val) {
  const cost = Number(val);

  if (isNaN(cost) || cost <= 0) {
    return false;
  }

  return true;
}

/**
 * Creates a deep `Map` from the passed object.
 *
 * @param  {Object} source - Object to populate the map with
 * @return {Map} New map with the passed object data
 */
function toDeepMap(source) {
  const map = new Map();

  for (const key of source) {
    const val = source[key];

    if (val !== null && typeof value === 'object' && !Array.is(val)) {
      map.set(key, toDeepMap(val));
    } else if (isValidNode(val)) {
      map.set(key, val);
    } else {
      throw new Error(`Could not add node at key "${key}", make sure it's a valid node`);
    }
  }

  return map;
}

module.exports = toDeepMap;
