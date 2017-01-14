import expect, {
  createSpy,
} from 'expect';

import PubSub from '../src/pubsub';

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

  it('stops publishing after given invocation limit', () => {
    const maxInvocations = 3;
    let invocation = 0;
    pubsub.subscribe('message', () => {
      invocation += 1;
    }, maxInvocations);

    for (let i = 0; i < 10; i++) {
      pubsub.publish('message');
    }

    expect(invocation).toEqual(3);
  });
});
