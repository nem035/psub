// symbol used to access the map of topics to its subscriptions
const __topicToSubscriptionsMap__ = Symbol('ts');
// symbol used to access the map of symbol to its subscription location
const __symbolToSubscriptionLocationMap__ = Symbol('sl');

const _publish = (subscriptions, ...args) => {
  // publish all subscriptions asynchronously
  subscriptions.forEach((sub) => {
    Promise.resolve()
      .then(() => sub.handler(...args))
      .catch(console.error);
  });
};

/** Class representing a PSub object */
class PSub {

  /**
   * Create a PSub instance.
   */
  constructor() {
    const attrs = () => ({
      value: new Map(),
      writable: false,
      configurable: false,
    });

    // create data maps
    Object.defineProperties(this, {
      [__topicToSubscriptionsMap__]: attrs(),
      [__symbolToSubscriptionLocationMap__]: attrs(),
    });
  }

  /**
   * Subscribes the given handler for the given topic.
   *
   * @example
   * // subscribe for the topic "notifications"
   * // call onNotification when a message arrives
   * const subscription = psub.subscribe(
   *   'notifications', // topic name
   *   onNotification,  // callback
   * );
   *
   * @param  {String} topic Topic name for which to subscribe the given handler
   * @param  {Function} handler Function to call when given topic is published
   * @return {Symbol} Symbol that can be used to unsubscribe this subscription
   */
  subscribe(topic, handler) {
    const symbol = Symbol(topic);

    const subscription = {
      symbol,
      handler,
    };

    const topicToSubscriptionsMap = this[__topicToSubscriptionsMap__];

    if (topicToSubscriptionsMap.has(topic)) {
      topicToSubscriptionsMap.get(topic).push(subscription);
    } else {
      topicToSubscriptionsMap.set(topic, [subscription]);
    }

    const subscriptions = topicToSubscriptionsMap.get(topic);

    // link the subscription symbol to subscription location
    const index = subscriptions.length - 1;
    this[__symbolToSubscriptionLocationMap__].set(symbol, {
      index,
      topic,
    });

    return symbol;
  }

  /**
   * Method to publish data to all subscribers for the given topic.
   *
   * @example
   * // publish an object to anybody listening
   * // to the topic 'message/channel'
   * psub.publish('message/channel', {
   *   id: 1,
   *   content: 'PSub is cool!'
   * })
   *
   * @param  {String} topic cubscription topic
   * @param  {Array}  args arguments to send to all subscribers for this topic
   */
  publish(topic, ...args) {
    const topicToSubscriptionsMap = this[__topicToSubscriptionsMap__];

    if (topic === '*') {
      for (const subscriptions of topicToSubscriptionsMap.values()) {
        _publish(subscriptions, ...args);
      }
    } else {
      const subscriptions = topicToSubscriptionsMap.get(topic) || [];
      _publish(subscriptions, ...args);
    }
  }

  /**
   * Cancel a subscription using the subscription symbol
   *
   * @example
   *
   * // unsubscribe using the subscription symbol
   * // obtained when you subscribed
   * const didUnsubscribe = psub.unsubscribe(subscriptionSymbol);
   *
   * @param  {Symbol} symbol subscription Symbol obtained when subscribing
   * @return {Boolean} true if subscription was cancelled, false otherwise
   */
  unsubscribe(symbol) {
    const symbolToLocationMap = this[__symbolToSubscriptionLocationMap__];

    // if given symbol doesn't exist, we cannot unsubscribe
    if (!symbolToLocationMap.has(symbol)) {
      return false;
    }

    const {index, topic} = symbolToLocationMap.get(symbol);

    const topicToSubscriptionsMap = this[__topicToSubscriptionsMap__];

    const subscriptions = topicToSubscriptionsMap.get(topic);

    // remove subscription
    if (subscriptions.length === 1) {
      topicToSubscriptionsMap.delete(topic);
    } else {
      subscriptions.splice(index, 1);
    }

    symbolToLocationMap.delete(symbol);

    return true;
  }
}

// prototype aliases
const alias = (name, alias) => {
  PSub.prototype[alias] = function(...args) {
    return this[name](...args);
  };
};

alias('subscribe', 'on');
alias('publish', 'emit');
alias('unsubscribe', 'off');

export default PSub;
