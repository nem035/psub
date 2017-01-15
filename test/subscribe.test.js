import PSub from '../src';
import expect from 'expect';

describe('subscribe', () => {
  let ps;

  beforeEach(() => {
    ps = new PSub();
  });

  const invalids = [null, false, {},
    [], '',
  ];

  it('throws invalid topic names', () => {
    for (const topic of invalids.concat([undefined, 2, Infinity, () => {}])) {
      expect(() => {
        ps.subscribe(topic, () => {});
      }).toThrow(TypeError, /Topic/);
    }
  });

  it('throws for invalid handlers', () => {
    for (const handler of invalids.concat([undefined, 2, Infinity])) {
      expect(() => {
        ps.subscribe('message', handler);
      }).toThrow(TypeError, /Handler/);
    }
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
});
