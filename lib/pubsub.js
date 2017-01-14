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

// symbol used to access the map of topics to their subscriptions
const topicToSubscriptionsMap = Symbol('topicToSubscriptionsMap');

/** Class representing a PubSub object */
class PubSub {

  /**
   * Create a PubSub instance.
   */
  constructor() {
    // map of topic name to arrays of subscriptions for that topic
    this[topicToSubscriptionsMap] = new Map();
  }

  /**
   * Subscribes the given handler for the given topic and the optional duration.
   * Default duration is Infinity.
   *
   * @example
   * const subscription = pubsub.subscribe('message', onMessage);
   *
   * @param  {String} topic Topic name for which to subscribe the given handler
   * @param  {Function} handler Function to be called when the given topic is published by another subscriber
   * @param  {Number} duration Optional integer denoting how many subscriptions should happen before automatically unsubscribing
   * @return {Symbol} Symbol that can be used to unsubscribe this subscription
   */
  subscribe(topic, handler, duration = Infinity) {
    _assertValidTopicAndHandler(topic, handler);

    // initialize empty array of subscriptions for the given topic, if necessary
    if (!this[topicToSubscriptionsMap].has(topic)) {
      this[topicToSubscriptionsMap].set(topic, []);
    }

    // unique symbol identifying this subscription
    const symbol = Symbol(topic);

    // create the new subscription object
    const subscription = new Subscription({
      symbol,
      handler,
      duration
    });

    // add the new subscription object
    this[topicToSubscriptionsMap]
      .get(topic)
      .push(subscription);

    // return symbol representing this subscription
    return symbol;
  }

  /**
   * Method to publish data to all subscribers for the given topic.
   *
   * @example
   * const didPublish = pubsub.publish('message/channel', { id: '31#fxxx', content: 'PubSub is cool!' })
   *
   * @param  {String} topic Topic for
   * @param  {Array}  args Array of arguments to send to all subscribers for this topic
   * @return {Boolean} Boolean that is true if publishing succeeded, false otherwise
   */
  publish(topic, ...args) {
    _assertValidTopic(topic);

    // obtain all subscriptions for a particular topic
    const subscriptions = this[topicToSubscriptionsMap].get(topic);

    // if nobody registered to this topic, return false
    if (!subscriptions || subscriptions.length === 0) {
      return false;
    }

    // publish all subscriptions
    // after each individual publish, cancel the subscription if it expired.
    subscriptions.forEach(sub => {
      if (sub.duration > 0) {
        sub.handler(...args);
        sub.duration -= 1;
      } else {
        this.unsubscribeHandler(topic, sub.handler);
      }
    });

    // if publish succeeded, return true
    return true;
  }

  /**
   * Delegates unsubscribing to appropriate method based on argument count.
   *
   * @example
   * const didUnsubscribe = pubsub.unsubscribe(subscriptionSymbol);
   * // or
   * const didUnsubscribe = pubsub.unsubscribe('message', onMessage);
   *
   * @return {Boolean} Boolean that is true if subscription was cancelled, false otherwise
   */
  unsubscribe(...args) {
    if (args.length === 1) {
      return this.unsubscribeSymbol(args[0]);
    } else if (args.length === 2) {
      return this.unsubscribeHandler(args[0], args[1]);
    } else {
      throw new TypeError('Must pass 1 or 2 arguments');
    }
  }

  /**
   * Cancel a subscription using the subscription symbol
   *
   * @example
   * const didUnsubscribe = pubsub.unsubscribe(subscriptionSymbol);
   *
   * @param  {Symbol} symbol subscription Symbol obtained when subscribing
   * @return {Boolean} Boolean that is true if subscription was cancelled, false otherwise
   */
  unsubscribeSymbol(symbol) {
    _assertSymbol(symbol);

    // iterate through all topic subscriptions
    for (const [topic, subscriptions] of this[topicToSubscriptionsMap].entries()) {
      // iterate through all handler for particular topic
      for (const [idx, subscription] of subscriptions.entries()) {
        // if symbol represents an existing subscription, remove it
        if (subscription.symbol === symbol) {
          subscriptions.splice(idx, 1);
          return true;
        }
      }
    }

    // return false if a subscription matching given symbol couldn't be found.
    return false;
  }

  /**
   * Cancel a subscription using the same topic name and handler that created it.
   *
   * @example
   * const didUnsubscribe = pubsub.unsubscribe('message', onMessage);
   *
   * @param  {String} topic Topic name from which to unsubscribe the given handler
   * @param  {Function} handler Function representing the handler that will be unsubscribed
   * @return {Boolean} Boolean that is true if subscription was cancelled, false otherwise
   */
  unsubscribeHandler(topic, handler) {
    _assertValidTopicAndHandler(topic, handler);

    // shortcircuit if nobody subscribed to the given topic
    if (!this[topicToSubscriptionsMap].has(topic)) {
      return false;
    }

    // extract all subscriptions for current topic
    const subscriptions = this[topicToSubscriptionsMap].get(topic);

    // if a matching handler is found, remove it and return true
    for (const [idx, subscription] of subscriptions.entries()) {
      if (subscription.handler === handler) {
        subscriptions.splice(idx, 1);
        return true;
      }
    }

    // return false if a subscription matching given topic&handler pair couldn't be found.
    return false;
  }
}

export default PubSub;
