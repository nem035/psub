import expect, {
  createSpy,
} from 'expect';

import PubSub from '../lib/pubsub';

describe('publish', () => {
  const pubsub = new PubSub();

  it('publishes subscription', () => {
    const handler = createSpy();
    const args = [2, '3', true];
    pubsub.subscribe('message', handler);
    const result = pubsub.publish('message', ...args);
    expect(handler).toHaveBeenCalledWith(...args);
    expect(result).toEqual(true);
  });

  it('stops publishing after duration expired', () => {
    const expectedDuration = 3;
    let duration = 0;
    pubsub.subscribe('message', () => {
      duration += 1;
    }, expectedDuration);

    for (let i = 0; i < 10; i++) {
      pubsub.publish('message');
    }

    expect(duration).toEqual(3);
  });
});
