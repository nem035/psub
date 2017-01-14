import PubSub from '../src/pubsub';
import expect from 'expect';

describe('publish', () => {
  it('publishes subscription', (done) => {
    const ps = new PubSub();
    const args = [2, '3', true];
    ps.subscribe('message', (...args) => {
      expect(args).toEqual(args);
      done();
    });
    const result = ps.publish('message', ...args);
    expect(result).toEqual(true);
  });

  it('does not publish a subscription when no one is listening', () => {
    const ps = new PubSub();
    const result = ps.publish('message');
    expect(result).toEqual(false);
  });

  it('publishes to all active subscriptions', (done1, done2) => {
    const ps = new PubSub();
    const args = [2, '3', true];
    ps.subscribe('message', (...a) => {
      expect(...a).toEqual(...args);
      done1();
    });
    ps.subscribe('message', (...a) => {
      expect(...a).toEqual(...args);
      done2();
    });
    const result = ps.publish('message', ...args);
    expect(result).toEqual(true);
  });
});
