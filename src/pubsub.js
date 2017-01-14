/**
 * Assert method to validate topic as a non-empty string.
 *
 * @param {String} topic topic name
 */
function _assertValidTopic(topic) {
  if (typeof topic !== 'string' || topic.length === 0) {
    throw new TypeError('Topic must be a non empty string');
  }
}

/**
 * Assert method to validate topic as a non-empty string
 * and handler as a function.
 *
 * @param {String} topic topic name
 * @param {Function} handler handler function
 */
function _assertValidTopicAndHandler(topic, handler) {
  _assertValidTopic(topic);
  if (typeof handler !== 'function') {
    throw new TypeError('Handler must be a function.');
  }
}

/**
 * Assert method to a symbol.
 *
 * @param {Symbol} symbol symbol that will be validated
 */
function _assertSymbol(symbol) {
  if (typeof symbol !== 'symbol') {
    throw new TypeError('Argument must be a symbol');
  }
}

/**
 * Class representing a Subscription object
 */
class Subscription {

  /**
   * Create a Subscription instance
   */
  constructor({
    symbol,
    handler,
  }) {
    this.symbol = symbol;
    this.handler = handler;
  }
}

// symbol used to access the map of topics to its subscriptions
const __topicToSubscriptionsMap__ = Symbol(
  '__topicToSubscriptionsMap__'
);
// symbol used to access the map of symbol to its subscription location
const __symbolToSubscriptionLocationMap__ = Symbol(
  '__symbolToSubscriptionLocationMap____'
);

/** Class representing a PubSub object */
class PubSub {

  /**
   * Create a PubSub instance.
   */
  constructor() {
    // create data maps
    Object.defineProperties(this, {
      [__topicToSubscriptionsMap__]: {
        value: new Map(),
        writable: false,
      },
      [__symbolToSubscriptionLocationMap__]: {
        value: new Map(),
        writable: false,
      },
    });
  }

  /**
   * Subscribes the given handler for the given topic.
   *
   * @example
   * const subscription = pubsub.subscribe('message', onMessage);
   *
   * // subscribe for a single publish event
   * const singleSubscription = pubsub.subscribe(
   *   'notifications', // topic name
   *   onNotification,  // callback
   * );
   *
   * @param  {String} topic Topic name for which to subscribe the given handler
   * @param  {Function} handler Function to call when given topic is published
   * @return {Symbol} Symbol that can be used to unsubscribe this subscription
   */
  subscribe(topic, handler) {
    _assertValidTopicAndHandler(topic, handler);

    // unique symbol identifying this subscription
    const symbol = Symbol(topic);

    // create the new subscription object
    const subscription = new Subscription({
      symbol,
      handler,
    });

    // obtain the map of topic to its subscriptions
    const map = this[__topicToSubscriptionsMap__];

    // initialize subscriptions for the given topic, or
    // add the new subscription to existing ones
    if (!map.has(topic)) {
      map.set(topic, [subscription]);
    } else {
      map.get(topic).push(subscription);
    }

    // obtain the subscriptions
    const subscriptions = map.get(topic);

    // link the subscription symbol to subscription location
    const index = subscriptions.length - 1;
    this[__symbolToSubscriptionLocationMap__].set(symbol, {
      index,
      topic,
    });

    // return symbol representing this subscription
    return symbol;
  }

  /**
   * Method to publish data to all subscribers for the given topic.
   *
   * @example
   * const didPublish = pubsub.publish('message/channel', {
   *   id: '31#fxxx',
   *   content: 'PubSub is cool!'
   * })
   *
   * @param  {String} topic Topic for
   * @param  {Array}  args Arguments to send to all subscribers for this topic
   * @return {Boolean} Boolean that's true if publish succeeded, false otherwise
   */
  publish(topic, ...args) {
    _assertValidTopic(topic);

    // obtain all subscriptions for a particular topic
    const subscriptions = this[__topicToSubscriptionsMap__].get(topic);

    // if nobody registered to this topic, return false
    if (!subscriptions || subscriptions.length === 0) {
      return false;
    }

    // publish all subscriptions
    subscriptions.forEach((sub) => {
      sub.handler(...args);
    });

    // if publish succeeded, return true
    return true;
  }

  /**
   * Cancel a subscription using the subscription symbol
   *
   * @example
   * const didUnsubscribe = pubsub.unsubscribe(subscriptionSymbol);
   *
   * @param  {Symbol} symbol subscription Symbol obtained when subscribing
   * @return {Boolean} true if subscription was cancelled, false otherwise
   */
  unsubscribe(symbol) {
    _assertSymbol(symbol);

    // obtain the symbol to subscription location map
    const symbolToLocationMap = this[__symbolToSubscriptionLocationMap__];

    // if given symbol doesn't exist, we cannot unsubscribe
    if (!symbolToLocationMap.has(symbol)) {
      return false;
    }

    // obtain subscription location
    const {index, topic} = symbolToLocationMap.get(symbol);

    // obtain topic to subscription map
    const topicToSubscriptionsMap = this[__topicToSubscriptionsMap__];

    // obtain subscriptions
    const subscriptions = topicToSubscriptionsMap.get(topic);

    // remove subscription
    if (subscriptions.length === 1) {
      topicToSubscriptionsMap.delete(topic);
    } else {
      subscriptions.splice(index, 1);
    }

    // remove subscription location
    symbolToLocationMap.delete(symbol);

    // signal successful unsubscription
    return true;
  }
}

export default PubSub;
