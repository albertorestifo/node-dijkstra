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
 * Returns object properties with symbol keys
 *
 * @param {Object} source - Object
 * @return {Keys} List of object keys with symbols keys included
 */
function getObjectKeysWithSymbols(source) {
  const keys = Object.keys(source);
  const symbols = (typeof Object.getOwnPropertySymbols === 'function')
    ? Object.getOwnPropertySymbols(source)
    : [];

  return keys.concat(symbols);
}

/**
 * Creates a deep `Map` from the passed object.
 *
 * @param  {Object} source - Object to populate the map with
 * @return {Map} New map with the passed object data
 */
function toDeepMap(source) {
  const map = new Map();
  const keys = getObjectKeysWithSymbols(source);

  keys.forEach((key) => {
    const val = source[key];

    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      return map.set(key, toDeepMap(val));
    }


    if (!isValidNode(val)) {
      throw new Error(`Could not add node at key "${key}", make sure it's a valid node`, val);
    }

    return map.set(key, Number(val));
  });

  return map;
}

module.exports = toDeepMap;
