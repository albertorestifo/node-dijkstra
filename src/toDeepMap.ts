import { NodeKey, GraphNode } from './Graph';

function isValidNode(val: unknown): boolean {
  const cost = Number(val);
  return !isNaN(cost) && cost > 0;
}

export function toDeepMap(source: Record<string, unknown>): Map<NodeKey, GraphNode> {
  const map = new Map<NodeKey, GraphNode>();
  const keys = Object.keys(source);

  keys.forEach((key) => {
    const val = source[key];

    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      return map.set(key, toDeepMap(val as Record<string, unknown>));
    }

    if (!isValidNode(val)) {
      throw new Error(`Could not add node at key "${key}", make sure it's a valid node`);
    }

    return map.set(key, Number(val));
  });

  return map;
}