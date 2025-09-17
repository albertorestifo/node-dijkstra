import { GraphNode } from './toDeepMap';

/**
 * Removes a key and all of its references from a map.
 * This function has no side-effects as it returns
 * a brand new map.
 */
export function removeDeepFromMap(
  map: Map<string | number, GraphNode>,
  key: string | number
): Map<string | number, GraphNode> {
  const newMap = new Map<string | number, GraphNode>();

  for (const [aKey, val] of map) {
    if (aKey !== key && val instanceof Map) {
      newMap.set(aKey, removeDeepFromMap(val, key));
    } else if (aKey !== key) {
      newMap.set(aKey, val);
    }
  }

  return newMap;
}