import PSub from '../src';
import expect from 'expect';

describe('subscribe', () => {
  let ps;

  beforeEach(() => {
    ps = new PSub();
  });

  it('returns a subscription symbol', () => {
    const handler = () => {};
    const symbol = ps.subscribe('message', handler);
    expect(symbol).toBeA('symbol');
  });

  it('contains proper subscription information', () => {
    const handler1 = () => {};
    const handler2 = () => {};
    ps.subscribe('message1', handler1);
    ps.subscribe('message2', handler2);
    for (const symbol of Object.getOwnPropertySymbols(ps)) {
      expect(ps[symbol].size).toEqual(2);
    }
  });

   it('subscribes through `on` alias', () => {
    const handler = () => {};
    const symbol = ps.on('message', handler);
    expect(symbol).toBeA('symbol');
  });
});
