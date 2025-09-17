import { GraphNode } from './toDeepMap';

/**
 * Validates a map to ensure all its values are either a number or a map
 */
export function validateDeep(map: Map<string | number, GraphNode>): void {
  if (!(map instanceof Map)) {
    throw new Error(`Invalid graph: Expected Map instead found ${typeof map}`);
  }

  map.forEach((value, key) => {
    if (typeof value === 'object' && value instanceof Map) {
      validateDeep(value);
      return;
    }

    if (typeof value !== 'number' || value <= 0) {
      throw new Error(
        `Values must be numbers greater than 0. Found value ${value} at ${key}`
      );
    }
  });
}