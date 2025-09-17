import { NodeKey, GraphNode } from './Graph';

export function removeDeepFromMap(
  map: Map<NodeKey, GraphNode>,
  key: NodeKey
): Map<NodeKey, GraphNode> {
  const newMap = new Map<NodeKey, GraphNode>();

  for (const [aKey, val] of map) {
    if (aKey !== key && val instanceof Map) {
      newMap.set(aKey, removeDeepFromMap(val, key));
    } else if (aKey !== key) {
      newMap.set(aKey, val);
    }
  }

  return newMap;
}