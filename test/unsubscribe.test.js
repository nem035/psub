import expect, {
  createSpy,
} from 'expect';

import PSub from '../src';

describe('unsubscribe', () => {
  let ps;

  beforeEach(() => {
    ps = new PSub();
  });

  const invalids = [null, false, {},
    [], '', undefined, 2, Infinity, () => {},
  ];

  it('throws on invalid argument count', () => {
    for (const args of [undefined, [1, 2, 3]]) {
      expect(() => {
        ps.unsubscribe(...args);
      }).toThrow(TypeError, /Symbol/);
    }
  });

  it('throws on invalid subscription symbols', () => {
    for (const s of invalids) {
      expect(() => {
        ps.unsubscribe(s);
      }).toThrow(TypeError, /Symbol/);
    }
  });

  it('returns false for non-existing subscriptions', () => {
    const result = ps.unsubscribe(Symbol());
    expect(result).toEqual(false);
  });

  it('returns true when unsubscribing the only subscription', () => {
    const subscription = ps.subscribe('message', () => {});
    const result = ps.unsubscribe(subscription);
    expect(result).toEqual(true);
  });

  it('returns true when unsubscribing one of the subscriptions', () => {
    const subscription = ps.subscribe('message', () => {});
    ps.subscribe('message', () => {});
    const result = ps.unsubscribe(subscription);
    expect(result).toEqual(true);
  });

  it('stops calling handlers for unsubscribed subscriptions', (done) => {
    const handler = createSpy();
    const subscription = ps.subscribe('message', handler);
    ps.unsubscribe(subscription);
    ps.publish('message');
    setTimeout(() => {
      expect(handler).toNotHaveBeenCalled();
      done();
    });
  });
});
