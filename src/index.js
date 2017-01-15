import {
  assertSymbol,
  assertValidTopic,
  assertValidTopicAndHandler,
} from './utils';

// symbol used to access the map of topics to its subscriptions
const __topicToSubscriptionsMap__ = Symbol('topicToSubscriptionsMap');
// symbol used to access the map of symbol to its subscription location
const __symbolToSubscriptionLocationMap__ = Symbol(
'symbolToSubscriptionLocationMap'
);

/** Class representing a PSub object */
class PSub {

  /**
   * Create a PSub instance.
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
    assertValidTopicAndHandler(topic, handler);

    const symbol = Symbol(topic);

    const subscription = {
      symbol,
      handler,
    };

    const topicToSubscriptionsMap = this[__topicToSubscriptionsMap__];

    // initialize subscriptions for the given topic, or
    // add the new subscription to existing ones
    if (!topicToSubscriptionsMap.has(topic)) {
      topicToSubscriptionsMap.set(topic, [subscription]);
    } else {
      topicToSubscriptionsMap.get(topic).push(subscription);
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
   * const didPublish = psub.publish('message/channel', {
   *   id: 1,
   *   content: 'PSub is cool!'
   * })
   *
   * @param  {String} topic cubscription topic
   * @param  {Array}  args arguments to send to all subscribers for this topic
   * @return {Boolean} true if publish succeeded, false otherwise
   */
  publish(topic, ...args) {
    assertValidTopic(topic);

    const subscriptions = this[__topicToSubscriptionsMap__].get(topic);

    // if nobody registered to this topic, return false
    if (!subscriptions || subscriptions.length === 0) {
      return false;
    }

    // publish all subscriptions asynchronously
    subscriptions.forEach((sub) => {
      Promise.resolve()
        .then(() => sub.handler(...args))
        .catch(console.error);
    });

    return true;
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
    assertSymbol(symbol);

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

export default PSub;
