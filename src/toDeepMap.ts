/**
 * Validates a cost for a node
 */
function isValidNode(val: unknown): boolean {
  const cost = Number(val);

  if (isNaN(cost) || cost <= 0) {
    return false;
  }

  return true;
}

export type GraphNode = number | Map<string | number, GraphNode>;

/**
 * Creates a deep `Map` from the passed object.
 */
export function toDeepMap(source: Record<string, unknown>): Map<string | number, GraphNode> {
  const map = new Map<string | number, GraphNode>();
  const keys = Object.keys(source);

  keys.forEach((key) => {
    const val = source[key];

    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      return map.set(key, toDeepMap(val as Record<string, unknown>));
    }

    if (!isValidNode(val)) {
      throw new Error(
        `Could not add node at key "${key}", make sure it's a valid node`
      );
    }

    return map.set(key, Number(val));
  });

  return map;
}