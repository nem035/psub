import expect, { createSpy } from 'expect';

import PubSub from '../lib/pubsub';

describe('publish', () => {
  const pubsub = new PubSub();

  it('publishes subscription', () => {
    const handler = createSpy();
    const args = [2, '3', true];
    pubsub.subscribe('someEvent', handler);
    const result = pubsub.publish('someEvent', ...args);
    expect(handler).toHaveBeenCalledWith(...args);
    expect(result).toEqual(true);
  });
});