import PubSub from '../src/pubsub';
import expect from 'expect';

describe('publish', () => {
  it('publishes subscription', (done) => {
    const pubsub = new PubSub();
    const args = [2, '3', true];
    pubsub.subscribe('message', (...args) => {
      expect(args).toEqual(args);
      done();
    });
    const result = pubsub.publish('message', ...args);
    expect(result).toEqual(true);
  });

  it('does not publish a subscription when no one is listening', () => {
    const pubsub = new PubSub();
    const result = pubsub.publish('message');
    expect(result).toEqual(false);
  });

  it('publishes to all active subscriptions', (done1, done2) => {
    const pubsub = new PubSub();
    const args = [2, '3', true];
    pubsub.subscribe('message', (...a) => {
      expect(...a).toEqual(...args);
      done1();
    });
    pubsub.subscribe('message', (...a) => {
      expect(...a).toEqual(...args);
      done2();
    });
    const result = pubsub.publish('message', ...args);
    expect(result).toEqual(true);
  });
});
