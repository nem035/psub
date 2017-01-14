import expect, {
  createSpy,
} from 'expect';

import PubSub from '../src/pubsub';

describe('unsubscribe', () => {
  const invalids = [null, false, {},
    [], '', undefined, 2, Infinity, () => {},
  ];

  it('throws on invalid argument count', () => {
    const pubsub = new PubSub();
    for (const args of [undefined, [1, 2, 3]]) {
      expect(() => {
        pubsub.unsubscribe(...args);
      }).toThrow(TypeError, /Symbol/);
    }
  });

  it('throws on invalid subscription symbols', () => {
    const pubsub = new PubSub();
    for (const s of invalids) {
      expect(() => {
        pubsub.unsubscribe(s);
      }).toThrow(TypeError, /Symbol/);
    }
  });

  it('returns false for non-existing subscriptions', () => {
    const pubsub = new PubSub();
    const result = pubsub.unsubscribe(Symbol());
    expect(result).toEqual(false);
  });

  it('returns true when unsubscribing the only subscription', () => {
    const pubsub = new PubSub();
    const subscription = pubsub.subscribe('message', () => {});
    const result = pubsub.unsubscribe(subscription);
    expect(result).toEqual(true);
  });

  it('returns true when unsubscribing one of the subscriptions', () => {
    const pubsub = new PubSub();
    const subscription = pubsub.subscribe('message', () => {});
    pubsub.subscribe('message', () => {});
    const result = pubsub.unsubscribe(subscription);
    expect(result).toEqual(true);
  });

  it('stops calling handlers for unsubscribed subscriptions', (done) => {
    const pubsub = new PubSub();
    const handler = createSpy();
    const subscription = pubsub.subscribe('message', handler);
    pubsub.unsubscribe(subscription);
    pubsub.publish('message');
    setTimeout(() => {
      expect(handler).toNotHaveBeenCalled();
      done();
    });
  });
});
