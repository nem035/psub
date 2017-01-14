function _assertValidEvent(event) {
  if (typeof event !== 'string' || event.length === 0) {
    throw new TypeError('Event must be a non empty string');
  }
}

function _assertValidEventAndHandler(event, handler) {
  _assertValidEvent(event);
  if (typeof handler !== 'function') {
    throw new TypeError('Handler must be a function.');
  }
}

function _assertSymbol(symbol) {
  if (typeof symbol !== 'symbol') {
    throw new TypeError('Argument must be a symbol');
  }
}

/**
 * Class representing a subscription instance.
 */
class Subscription {
  constructor({ symbol, handler, duration }) {
    if (typeof duration !== 'number' || duration < 1) {
      throw new TypeError('Duration must by a number > 0');
    }

    this.symbol = symbol;
    this.duration = duration;
    this.handler = handler;
  }
}

// symbol used to access the map of events to their subscriptions
const eventToSubscriptionsMap = Symbol('eventToSubscriptionsMap');

class PubSub {
  constructor() {
    // map of event name to arrays of subscriptions for that event
    this[eventToSubscriptionsMap] = new Map();
  }

  /**
   * Subscribes the given handler for the given event and the optional duration.
   * Default duration is Infinity.
   * @param  {String} event   Event name for which to subscribe the given handler
   * @param  {Function} handler Function to be called when the given event is published by another subscriber
   * @param  {Number} duration Optional integer denoting how many subscriptions should happen before automatically unsubscribing
   * @return {[type]}         [description]
   */
  subscribe(event, handler, duration = Infinity) {
    _assertValidEventAndHandler(event, handler);

    // initialize empty array of subscriptions for the given event, if necessary
    if (!this[eventToSubscriptionsMap].has(event)) {
      this[eventToSubscriptionsMap].set(event, []);
    }

    // unique symbol identifying this subscription
    const symbol = Symbol(event);

    // create the new subscription object
    const subscription = new Subscription({ symbol, handler, duration });

    // add the new subscription object
    this[eventToSubscriptionsMap]
      .get(event)
      .push(subscription);

    // return symbol representing this subscription
    return symbol;
  }

  /**
   * Method to publish data to all subscribers for the given event.
   *
   * @param  {String} event Event for
   * @param  {Array}  args  Array of arguments to send to all subscribers for this event
   * @return {Boolean}      Boolean that is true if publishing succeeded, false otherwise
   */
  publish(event, ...args) {
    _assertValidEvent(event);

    // obtain all subscriptions for a particular event
    const subscriptions = this[eventToSubscriptionsMap].get(event);

    // if nobody registered to this event, return false
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
        this.unsubscribeHandler(event, sub.handler);
      }
    });

    // if publish succeeded, return true
    return true;
  }

  /**
   * Delegates unsubscribing to appropriate method based on argument count.
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
   * @param  {Symbol} symbol subscription symbol
   * @return {Boolean} boolean that is true if subscription was cancelled, false otherwise
   */
  unsubscribeSymbol(symbol) {
    _assertSymbol(symbol);

    // iterate through all event subscriptions
    for (const [event, subscriptions] of this[eventToSubscriptionsMap].entries()) {
      // iterate through all handler for particular event
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
   * Cancel a subscription using the same event name and handler that created it.
   * @param  {String} event Event name from which to unsubscribe the given handler
   * @param  {Function} handler Function representing the handler that will be unsubscribed
   * @return {Boolean} boolean that is true if subscription was cancelled, false otherwise
   */
  unsubscribeHandler(event, handler) {
    _assertValidEventAndHandler(event, handler);

    // shortcircuit if nobody subscribed to the given event
    if (!this[eventToSubscriptionsMap].has(event)) {
      return false;
    }

    // extract all subscriptions for current event
    const subscriptions = this[eventToSubscriptionsMap].get(event);

    // if a matching handler is found, remove it and return true
    for (const [idx, subscription] of subscriptions.entries()) {
      console.info('COMPARING:', subscription.handler === handler);
      if (subscription.handler === handler) {
        subscriptions.splice(idx, 1);
        return true;
      }
    }

    // return false if a subscription matching given event&handler pair couldn't be found.
    return false;
  }
}

export default PubSub;
