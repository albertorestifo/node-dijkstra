import 'mocha';
import 'must';

import { removeDeepFromMap } from '../src/removeDeepFromMap';

describe('removeDeepFromMap', () => {
  it('returns a map without the passed key', () => {
    const map = new Map();
    map.set('a', 1);
    map.set('b', 2);

    const newMap = removeDeepFromMap(map, 'b');

    newMap.has('b').must.be.false();
    newMap.has('a').must.be.true();
  });

  it('removes a deep reference to the key', () => {
    const map = new Map();
    const barMap = new Map();

    barMap.set('bar', 1);
    barMap.set('foo', 2);

    map.set('foo', barMap);
    map.set('bar', 3);

    const newMap = removeDeepFromMap(map, 'bar');

    newMap.has('foo').must.be.true();
    (newMap.get('foo') as any).has('foo').must.be.true();
    (newMap.get('foo') as any).has('bar').must.be.false();
    newMap.has('bar').must.be.false();
  });

  it('produces no side-effects', () => {
    const map = new Map();
    map.set('a', 1);
    map.set('b', 2);

    const newMap = removeDeepFromMap(map, 'b');

    newMap.has('b').must.be.false();
    map.has('b').must.be.true();
  });
});