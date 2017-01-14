import PubSub from '../src/pubsub';
import expect from 'expect';

describe('subscribe', () => {
  const invalids = [null, false, {},
    [], '',
  ];

  it('throws invalid topic names', () => {
    const ps = new PubSub();
    for (const topic of invalids.concat([undefined, 2, Infinity, () => {}])) {
      expect(() => {
        ps.subscribe(topic, () => {});
      }).toThrow(TypeError, /Topic/);
    }
  });

  it('throws for invalid handlers', () => {
    const ps = new PubSub();
    for (const handler of invalids.concat([undefined, 2, Infinity])) {
      expect(() => {
        ps.subscribe('message', handler);
      }).toThrow(TypeError, /Handler/);
    }
  });

  it('returns a subscription symbol', () => {
    const ps = new PubSub();
    const handler = () => {};
    const symbol = ps.subscribe('message', handler);
    expect(symbol).toBeA('symbol');
  });

  it('contains proper subscription information', () => {
    const ps = new PubSub();
    const handler1 = () => {};
    const handler2 = () => {};
    ps.subscribe('message1', handler1);
    ps.subscribe('message2', handler2);
    for (const symbol of Object.getOwnPropertySymbols(ps)) {
      expect(ps[symbol].size).toEqual(2);
    }
  });
});
