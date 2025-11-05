export interface QueueEntry<T = string | number> {
  key: T;
  priority: number;
}

export class PriorityQueue<T = string | number> {
  private readonly keys: Set<T>;
  private readonly queue: QueueEntry<T>[];

  constructor() {
    this.keys = new Set<T>();
    this.queue = [];
  }

  private sort(): void {
    this.queue.sort((a, b) => a.priority - b.priority);
  }

  set(key: T, value: number): number {
    const priority = Number(value);
    if (isNaN(priority)) throw new TypeError('"priority" must be a number');

    if (!this.keys.has(key)) {
      this.keys.add(key);
      this.queue.push({ key, priority });
    } else {
      this.queue.map((element) => {
        if (element.key === key) {
          Object.assign(element, { priority });
        }
        return element;
      });
    }

    this.sort();
    return this.queue.length;
  }

  next(): QueueEntry<T> {
    const element = this.queue.shift();
    
    if (!element) {
      throw new Error('Queue is empty');
    }

    this.keys.delete(element.key);
    return element;
  }

  isEmpty(): boolean {
    return Boolean(this.queue.length === 0);
  }

  has(key: T): boolean {
    return this.keys.has(key);
  }

  get(key: T): QueueEntry<T> | undefined {
    return this.queue.find((element) => element.key === key);
  }
}