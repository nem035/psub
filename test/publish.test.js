import expect, {
  createSpy,
} from 'expect';

import PubSub from '../src/pubsub';

describe('publish', () => {
  it('publishes subscription', () => {
    const pubsub = new PubSub();
    const handler = createSpy();
    const args = [2, '3', true];
    pubsub.subscribe('message', handler);
    const result = pubsub.publish('message', ...args);
    expect(handler).toHaveBeenCalledWith(...args);
    expect(result).toEqual(true);
  });

  it('does not publish a subscription when no one is listening', () => {
    const pubsub = new PubSub();
    const result = pubsub.publish('message');
    expect(result).toEqual(false);
  });

  it('publishes to all active subscriptions', () => {
    const pubsub = new PubSub();
    const handlers = new Array(3).fill().map(() => createSpy());
    const args = [2, '3', true];
    handlers.forEach((handler) => {
      pubsub.subscribe('message', handler);
    });
    const result = pubsub.publish('message', ...args);
    expect(result).toEqual(true);
    handlers.forEach((handler) => {
      expect(handler).toHaveBeenCalledWith(...args);
    });
  });
});
