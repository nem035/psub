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
    ps.publish('message', ...args);
  });

  it('publishes to all topic subscriptions, in FIFO order', (done) => {
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

    ps.publish('message', ...args);
  });

  it('publishes to all topic subscriptions', (done) => {
    let firstIsCalled = createSpy();

    ps.subscribe('123', (...a) => {
      expect(...a).toEqual(...args);
      firstIsCalled();
    });
    ps.subscribe('abc', (...a) => {
      expect(...a).toEqual(...args);
      expect(firstIsCalled).toHaveBeenCalled();
      done();
    });

    ps.publish('*', ...args);
  });
});
