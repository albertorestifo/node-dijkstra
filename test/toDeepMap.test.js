/* eslint-env node, mocha */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

require('must');
const demand = require('must');

const toDeepMap = require('../libs/toDeepMap');

describe('toDeepMap()', () => {
  it('transforms a one level object', () => {
    const obj = { example: 1 };

    const map = toDeepMap(obj);

    map.size.must.equal(1);
    map.get('example').must.equal(1);
  });

  it('transforms a two level object', () => {
    const obj = {
      a: { b: 1 },
    };

    const map = toDeepMap(obj);

    map.size.must.equal(1);
    map.get('a').must.be.instanceOf(Map);
    map.get('a').get('b').must.equal(1);
  });

  it('transforms a three level object', () => {
    const obj = {
      a: {
        b: { c: 1 },
      },
    };

    const map = toDeepMap(obj);

    map.size.must.equal(1);
    map.get('a').must.be.instanceOf(Map);
    map.get('a').get('b').must.be.instanceOf(Map);
    map.get('a').get('b').get('c').must.equal(1);
  });

  it('transforms a four level object', () => {
    const obj = {
      a: {
        b: {
          c: { d: 1 },
        },
      },
    };

    const map = toDeepMap(obj);

    map.size.must.equal(1);
    map.get('a').must.be.instanceOf(Map);
    map.get('a').get('b').get('c').must.be.instanceOf(Map);
    map.get('a').get('b').get('c').get('d').must.equal(1);
  });

  it('rejects non-number values', () => {
    const obj = { example: null };

    demand(toDeepMap.bind(this, obj))
      .to.throw(Error, /valid node/);
  });

  it('rejects negative values', () => {
    const obj = { example: -3 };

    demand(toDeepMap.bind(this, obj))
      .to.throw(Error, /valid node/);
  });

  it('rejects 0', () => {
    const obj = { example: 0 };

    demand(toDeepMap.bind(this, obj))
      .to.throw(Error, /valid node/);
  });

  it('accepts 0.02', () => {
    const obj = { example: 0.02 };

    const map = toDeepMap(obj);

    map.size.must.equal(1);
    map.get('example').must.equal(0.02);
  });

  it('accepts a string reppreseting a number', () => {
    const obj = { example: '4' };

    const map = toDeepMap(obj);

    map.size.must.equal(1);
    map.get('example').must.equal(4);
  });
});
