const {PSub} = require('../src');

import expect from 'expect';

describe('modules', () => {
  it('works for common js modules', () => {
    const ps = new PSub();
    expect(ps).toBeA('object');
    expect(ps.subscribe).toBeA('function');
    expect(ps.publish).toBeA('function');
    expect(ps.unsubscribe).toBeA('function');
  });
});
