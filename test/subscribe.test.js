import PubSub from '../src/pubsub';
import expect from 'expect';

describe('subscribe', () => {
  const invalids = [null, false, {},
    [], '',
  ];

  it('throws invalid topic names', () => {
    const pubsub = new PubSub();
    for (const topic of invalids.concat([undefined, 2, Infinity, () => {}])) {
      expect(() => {
        pubsub.subscribe(topic, () => {});
      }).toThrow(TypeError, /Topic/);
    }
  });

  it('throws for invalid handlers', () => {
    const pubsub = new PubSub();
    for (const handler of invalids.concat([undefined, 2, Infinity])) {
      expect(() => {
        pubsub.subscribe('message', handler);
      }).toThrow(TypeError, /Handler/);
    }
  });

  it('returns a subscription symbol', () => {
    const pubsub = new PubSub();
    const handler = () => {};
    const symbol = pubsub.subscribe('message', handler);
    expect(symbol).toBeA('symbol');
  });

  it('contains proper subscription information', () => {
    const pubsub = new PubSub();
    const handler1 = () => {};
    const handler2 = () => {};
    pubsub.subscribe('message1', handler1);
    pubsub.subscribe('message2', handler2);
    for (const symbol of Object.getOwnPropertySymbols(pubsub)) {
      expect(pubsub[symbol].size).toEqual(2);
    }
  });
});
