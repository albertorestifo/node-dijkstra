/* eslint-env node, mocha */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

require('must');
const demand = require('must');

const validateDeep = require('../libs/validateDeep');

describe('validateDeep()', () => {
  it('does nothing on a valid deep map', () => {
    const m = new Map();
    const a = new Map();
    a.set('a', 1);
    m.set('a', a);

    validateDeep(m);
  });

  it('rejects non-number values', () => {
    const m = new Map();
    const a = new Map();
    a.set('a', 'something');
    m.set('a', a);

    demand(validateDeep.bind(this, m))
      .to.throw(Error, /must be numbers/);
  });

  it('rejects negative values', () => {
    const m = new Map();
    const a = new Map();
    a.set('a', -3);
    m.set('a', a);

    demand(validateDeep.bind(this, m))
      .to.throw(Error, /must be numbers/);
  });

  it('rejects 0', () => {
    const m = new Map();
    const a = new Map();
    a.set('a', 0);
    m.set('a', a);

    demand(validateDeep.bind(this, m))
      .to.throw(Error, /must be numbers/);
  });

  it('accepts 0.02', () => {
    const m = new Map();
    const a = new Map();
    a.set('a', 0.02);
    m.set('a', a);

    validateDeep(m);
  });
});
