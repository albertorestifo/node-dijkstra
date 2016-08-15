/* eslint-env node, mocha */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

require('must');

const removeDeepFromMap = require('../libs/removeDeepFromMap');

describe('removeDeepFromMap', () => {
  it('returns a map without the passed key', () => {
    const map = new Map();
    map.set('a', true);
    map.set('b', true);

    const newMap = removeDeepFromMap(map, 'b');

    newMap.has('b').must.be.false();
    newMap.has('a').must.be.true();
  });

  it('removes a deep reference to the key', () => {
    const map = new Map();
    const barMap = new Map();

    barMap.set('bar', true);
    barMap.set('foo', true);

    map.set('foo', barMap);
    map.set('bar', true);

    const newMap = removeDeepFromMap(map, 'bar');

    newMap.has('foo').must.be.true();
    newMap.get('foo').has('foo').must.be.true();
    newMap.get('foo').has('bar').must.be.false();
    newMap.has('bar').must.be.false();
  });

  it('produes no side-effects', () => {
    const map = new Map();
    map.set('a', true);
    map.set('b', true);

    const newMap = removeDeepFromMap(map, 'b');

    newMap.has('b').must.be.false();
    map.has('b').must.be.true();
  });
});
