import expect, { createSpy } from 'expect';

import PubSub from '../lib/pubsub';

describe('unsubscribe', () => {
  const pubsub = new PubSub();

  const invalids = [null, false, {}, [], '', undefined, 2, Infinity, () => { }];

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
    const result2 = pubsub.unsubscribe('does not exist', () => { });
    expect(result2).toEqual(false);
    pubsub.subscribe('someEvent', () => { });
    const result3 = pubsub.unsubscribe('someEvent', () => { });
    expect(result3).toEqual(false);
  });

  it('returns true when unsubscribing existing subscriptions', () => {
    const result = pubsub.unsubscribe(
      pubsub.subscribe('someEvent', () => { })
    );
    expect(result).toEqual(true);
  });

  it('stops calling handlers for unsubscribed subscriptions', () => {
    const handler = createSpy();
    const result = pubsub.unsubscribe(
      pubsub.subscribe('someEvent', handler)
    );
    pubsub.publish('someEvent');
    expect(handler).toNotHaveBeenCalled();
  });

  it('allows unsubscribing using event name and handler reference', () => {
    const handler = createSpy();
    const event = 'someEvent';
    pubsub.subscribe(event, handler);
    const result = pubsub.unsubscribe(event, handler);
    expect(result).toEqual(true);
    pubsub.publish('someEvent');
    expect(handler).toNotHaveBeenCalled();
  })
});