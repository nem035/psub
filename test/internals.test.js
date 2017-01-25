import PSub from '../src';
import expect from 'expect';

describe('internals', () => {
  let ps;

  const symbols = () => Object.getOwnPropertySymbols(ps);

  beforeEach(() => {
    ps = new PSub();
  });

  it('internal topicToSubscriptionsMap is not writable', () => {
    expect(() => {
      const [__topicToSubscriptionsMap__] = symbols();
      ps[__topicToSubscriptionsMap__] = 'Something Else';
    }).toThrow();
  });

  it('internal topicToSubscriptionsMap is not configurable', () => {
    expect(() => {
      const [__topicToSubscriptionsMap__] = symbols();
      Object.defineProperty(
        ps,
        __topicToSubscriptionsMap__,
        {configurable: true}
      );
    }).toThrow(TypeError);
  });

  it('internal topicToSubscriptionsMap is not deletable', () => {
    expect(() => {
    const [__topicToSubscriptionsMap__] = symbols();
    delete ps[__topicToSubscriptionsMap__];
    }).toThrow(TypeError);
  });

  it('internal symbolToSubscriptionLocationMap is not writable', () => {
    expect(() => {
      const [, __symbolToSubscriptionLocationMap__] = symbols();
      ps[__symbolToSubscriptionLocationMap__] = 'Something Else';
    }).toThrow();
  });

  it('internal symbolToSubscriptionLocationMap is not configurable', () => {
    expect(() => {
      const [, __symbolToSubscriptionLocationMap__] = symbols();
      Object.defineProperty(
        ps,
        __symbolToSubscriptionLocationMap__,
        {configurable: true}
      );
    }).toThrow(TypeError);
  });

  it('internal symbolToSubscriptionLocationMap is not deletable', () => {
    expect(() => {
    const [, __symbolToSubscriptionLocationMap__] = symbols();
    delete ps[__symbolToSubscriptionLocationMap__];
    }).toThrow(TypeError);
  });
});
