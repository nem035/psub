import PubSub from '../lib/pubsub';
import expect from 'expect';

describe('subscribe', () => {
  const pubsub = new PubSub();

  const invalids = [null, false, {}, [], ''];

  it('throws invalid event names', () => {
    for (const event of invalids.concat([undefined, 2, Infinity, () => { }])) {
      expect(() => {
        pubsub.subscribe(event, () => { });
      }).toThrow(TypeError, /Event/);
    }
  });

  it('throws for invalid handlers', () => {
    for (const handler of invalids.concat([undefined, 2, Infinity])) {
      expect(() => {
        pubsub.subscribe('someEvent', handler);
      }).toThrow(TypeError, /Handler/);
    }
  });

  it('throws for invalid duration', () => {
    for (const invalid of invalids.concat([-3, 0, () => { }])) {
      expect(() => {
        pubsub.subscribe('someEvent', () => { }, invalid);
      }).toThrow(TypeError, /Duration/);
    }
  });

  it('returns a subscription symbol', () => {
    const handler = () => { };
    const symbol = pubsub.subscribe('someEvent', handler);
    expect(symbol).toBeA('symbol');
  });
});
