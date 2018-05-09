'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Validates a cost for a node
 *
 * @private
 * @param {number} val - Cost to validate
 * @return {bool}
 */
function isValidNode(val) {
  var cost = Number(val);

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
  var map = new Map();
  var keys = Object.keys(source);

  keys.forEach(function (key) {
    var val = source[key];

    if (val !== null && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && !Array.isArray(val)) {
      return map.set(key, toDeepMap(val));
    }

    if (!isValidNode(val)) {
      throw new Error('Could not add node at key "' + key + '", make sure it\'s a valid node', val);
    }

    return map.set(key, Number(val));
  });

  return map;
}

module.exports = toDeepMap;