import PubSub from '../src/pubsub';
import expect from 'expect';

describe('subscribe', () => {
  const pubsub = new PubSub();

  const invalids = [null, false, {},
    [], '',
  ];

  it('throws invalid topic names', () => {
    for (const topic of invalids.concat([undefined, 2, Infinity, () => {}])) {
      expect(() => {
        pubsub.subscribe(topic, () => {});
      }).toThrow(TypeError, /Topic/);
    }
  });

  it('throws for invalid handlers', () => {
    for (const handler of invalids.concat([undefined, 2, Infinity])) {
      expect(() => {
        pubsub.subscribe('message', handler);
      }).toThrow(TypeError, /Handler/);
    }
  });

  it('throws for invalid duration', () => {
    for (const invalid of invalids.concat([-3, 0, () => {}])) {
      expect(() => {
        pubsub.subscribe('message', () => {}, invalid);
      }).toThrow(TypeError, /Duration/);
    }
  });

  it('returns a subscription symbol', () => {
    const handler = () => {};
    const symbol = pubsub.subscribe('message', handler);
    expect(symbol).toBeA('symbol');
  });
});
