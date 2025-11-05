import 'mocha';
import 'must';
const demand = require('must');

import { toDeepMap } from '../src/toDeepMap';

describe('toDeepMap()', () => {
  it('transforms a one level object', () => {
    const obj = { example: 1 };

    const map = toDeepMap(obj);

    map.size.must.equal(1);
    map.get('example')!.must.equal(1);
  });

  it('transforms a two level object', () => {
    const obj = {
      a: { b: 1 },
    };

    const map = toDeepMap(obj);

    map.size.must.equal(1);
    map.get('a')!.must.be.instanceOf(Map);
    (map.get('a') as any).get('b').must.equal(1);
  });

  it('transforms a three level object', () => {
    const obj = {
      a: {
        b: { c: 1 },
      },
    };

    const map = toDeepMap(obj);

    map.size.must.equal(1);
    map.get('a')!.must.be.instanceOf(Map);
    ((map.get('a') as any).get('b') as any).must.be.instanceOf(Map);
    (((map.get('a') as any).get('b') as any).get('c') as any).must.equal(1);
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
    map.get('a')!.must.be.instanceOf(Map);
    ((map.get('a') as any).get('b') as any).get('c').must.be.instanceOf(Map);
    (((map.get('a') as any).get('b') as any).get('c') as any).get('d').must.equal(1);
  });

  it('rejects non-number values', () => {
    const obj = { example: null };

    demand(toDeepMap.bind(this, obj)).to.throw(Error, /valid node/);
  });

  it('rejects negative values', () => {
    const obj = { example: -3 };

    demand(toDeepMap.bind(this, obj)).to.throw(Error, /valid node/);
  });

  it('rejects 0', () => {
    const obj = { example: 0 };

    demand(toDeepMap.bind(this, obj)).to.throw(Error, /valid node/);
  });

  it('accepts 0.02', () => {
    const obj = { example: 0.02 };

    const map = toDeepMap(obj);

    map.size.must.equal(1);
    map.get('example')!.must.equal(0.02);
  });

  it('accepts a string representing a number', () => {
    const obj = { example: '4' };

    const map = toDeepMap(obj);

    map.size.must.equal(1);
    map.get('example')!.must.equal(4);
  });
});