'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Validate a map to ensure all it's values are either a number or a map
 *
 * @param {Map} map - Map to valiadte
 */
function validateDeep(map) {
  if (!(map instanceof Map)) {
    throw new Error('Invalid graph: Expected Map instead found ' + (typeof map === 'undefined' ? 'undefined' : _typeof(map)));
  }

  map.forEach(function (value, key) {
    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value instanceof Map) {
      validateDeep(value);
      return;
    }

    if (typeof value !== 'number' || value <= 0) {
      throw new Error('Values must be numbers greater than 0. Found value ' + value + ' at ' + key);
    }
  });
}

module.exports = validateDeep;