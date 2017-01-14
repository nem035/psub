function _assertValidTopic(topic) {
  if (typeof topic !== 'string' || topic.length === 0) {
    throw new TypeError('Topic must be a non empty string');
  }
}

function _assertValidTopicAndHandler(topic, handler) {
  _assertValidTopic(topic);
  if (typeof handler !== 'function') {
    throw new TypeError('Handler must be a function.');
  }
}

function _assertSymbol(symbol) {
  if (typeof symbol !== 'symbol') {
    throw new TypeError('Argument must be a symbol');
  }
}

class Subscription {
  constructor({
    symbol,
    handler,
    duration
  }) {
    if (typeof duration !== 'number' || duration < 1) {
      throw new TypeError('Duration must by a number > 0');
    }

    this.symbol = symbol;
    this.duration = duration;
    this.handler = handler;
  }
}

const topicToSubscriptionsMap = Symbol('topicToSubscriptionsMap');

class PubSub {
  constructor() {
    this[topicToSubscriptionsMap] = new Map();
  }

  subscribe(topic, handler, duration = Infinity) {
    _assertValidTopicAndHandler(topic, handler);

    if (!this[topicToSubscriptionsMap].has(topic)) {
      this[topicToSubscriptionsMap].set(topic, []);
    }

    const symbol = Symbol(topic);

    const subscription = new Subscription({
      symbol,
      handler,
      duration
    });

    this[topicToSubscriptionsMap]
      .get(topic)
      .push(subscription);

    return symbol;
  }

  publish(topic, ...args) {
    _assertValidTopic(topic);

    const subscriptions = this[topicToSubscriptionsMap].get(topic);

    if (!subscriptions || subscriptions.length === 0) {
      return false;
    }

    subscriptions.forEach(sub => {
      if (sub.duration > 0) {
        sub.handler(...args);
        sub.duration -= 1;
      } else {
        this.unsubscribeHandler(topic, sub.handler);
      }
    });

    return true;
  }

  unsubscribe(...args) {
    if (args.length === 1) {
      return this.unsubscribeSymbol(args[0]);
    } else if (args.length === 2) {
      return this.unsubscribeHandler(args[0], args[1]);
    } else {
      throw new TypeError('Must pass 1 or 2 arguments');
    }
  }

  unsubscribeSymbol(symbol) {
    _assertSymbol(symbol);

    for (const [topic, subscriptions] of this[topicToSubscriptionsMap].entries()) {
      for (const [idx, subscription] of subscriptions.entries()) {
        if (subscription.symbol === symbol) {
          subscriptions.splice(idx, 1);
          return true;
        }
      }
    }

    return false;
  }

  unsubscribeHandler(topic, handler) {
    _assertValidTopicAndHandler(topic, handler);

    if (!this[topicToSubscriptionsMap].has(topic)) {
      return false;
    }

    const subscriptions = this[topicToSubscriptionsMap].get(topic);

    for (const [idx, subscription] of subscriptions.entries()) {
      if (subscription.handler === handler) {
        subscriptions.splice(idx, 1);
        return true;
      }
    }

    return false;
  }
}
