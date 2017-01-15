import expect, {createSpy} from 'expect';

import PSub from '../src';

describe('publish', () => {
  let ps;
  let args;

  beforeEach(() => {
    ps = new PSub();
    args = [2, '3', true];
  });

  it('publishes subscription', (done) => {
    ps.subscribe('message', (...args) => {
      expect(args).toEqual(args);
      done();
    });
    const result = ps.publish('message', ...args);
    expect(result).toEqual(true);
  });

  it('does not publish a subscription when no one is listening', () => {
    const result = ps.publish('message');
    expect(result).toEqual(false);
  });

  it('publishes to all active subscriptions, in FIFO order', (done) => {
    let firstIsCalled = createSpy();

    ps.subscribe('message', (...a) => {
      expect(...a).toEqual(...args);
      firstIsCalled();
    });
    ps.subscribe('message', (...a) => {
      expect(...a).toEqual(...args);
      expect(firstIsCalled).toHaveBeenCalled();
      done();
    });
    const result = ps.publish('message', ...args);
    expect(result).toEqual(true);
  });
});
