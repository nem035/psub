import expect, {
  createSpy,
} from 'expect';

import PubSub from '../src/pubsub';

describe('unsubscribe', () => {
  const pubsub = new PubSub();

  const invalids = [null, false, {},
    [], '', undefined, 2, Infinity, () => {},
  ];

  it('throws on invalid argument count', () => {
    for (const args of [undefined, [1, 2, 3]]) {
      expect(() => {
        pubsub.unsubscribe(...args);
      }).toThrow(TypeError, /Symbol/);
    }
  });

  it('throws on invalid subscription symbols', () => {
    for (const s of invalids) {
      expect(() => {
        pubsub.unsubscribe(s);
      }).toThrow(TypeError, /Symbol/);
    }
  });

  it('returns false for non-existing subscriptions', () => {
    const result1 = pubsub.unsubscribe(Symbol());
    expect(result1).toEqual(false);
    const result2 = pubsub.unsubscribe('does not exist', () => {});
    expect(result2).toEqual(false);
    pubsub.subscribe('message', () => {});
    const result3 = pubsub.unsubscribe('message', () => {});
    expect(result3).toEqual(false);
  });

  it('returns true when unsubscribing existing subscriptions', () => {
    const result = pubsub.unsubscribe(
      pubsub.subscribe('message', () => {})
    );
    expect(result).toEqual(true);
  });

  it('stops calling handlers for unsubscribed subscriptions', () => {
    const handler = createSpy();
    pubsub.unsubscribe(
      pubsub.subscribe('message', handler)
    );
    pubsub.publish('message');
    expect(handler).toNotHaveBeenCalled();
  });

  it('allows unsubscribing using topic name and handler reference', () => {
    const handler = createSpy();
    const topic = 'message';
    pubsub.subscribe(topic, handler);
    const result = pubsub.unsubscribe(topic, handler);
    expect(result).toEqual(true);
    pubsub.publish('message');
    expect(handler).toNotHaveBeenCalled();
  });
});
