import expect, {
  createSpy,
} from 'expect';

import PubSub from '../src/pubsub';

describe('unsubscribe', () => {
  const invalids = [null, false, {},
    [], '', undefined, 2, Infinity, () => {},
  ];

  it('throws on invalid argument count', () => {
    const ps = new PubSub();
    for (const args of [undefined, [1, 2, 3]]) {
      expect(() => {
        ps.unsubscribe(...args);
      }).toThrow(TypeError, /Symbol/);
    }
  });

  it('throws on invalid subscription symbols', () => {
    const ps = new PubSub();
    for (const s of invalids) {
      expect(() => {
        ps.unsubscribe(s);
      }).toThrow(TypeError, /Symbol/);
    }
  });

  it('returns false for non-existing subscriptions', () => {
    const ps = new PubSub();
    const result = ps.unsubscribe(Symbol());
    expect(result).toEqual(false);
  });

  it('returns true when unsubscribing the only subscription', () => {
    const ps = new PubSub();
    const subscription = ps.subscribe('message', () => {});
    const result = ps.unsubscribe(subscription);
    expect(result).toEqual(true);
  });

  it('returns true when unsubscribing one of the subscriptions', () => {
    const ps = new PubSub();
    const subscription = ps.subscribe('message', () => {});
    ps.subscribe('message', () => {});
    const result = ps.unsubscribe(subscription);
    expect(result).toEqual(true);
  });

  it('stops calling handlers for unsubscribed subscriptions', (done) => {
    const ps = new PubSub();
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
