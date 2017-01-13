function _assertValidEvent(event) {
  if (typeof event !== 'string') {
    throw new TypeError(`Event must be a string ${event}`);
  }
}

function _assertValidEventAndHandler(event, handler) {
  this._assertValidEvent(event);
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

    this.handler = () => {
      if (duration > 0) {
        handler();
        duration -= 1;
      }
    };
  }

  isExpired() {
    return this.duration === 0;
  }
}

// symbol used to access the map of events to their handlers
const eventToHandlersMap = Symbol('eventToHandlersMap');

class PubSub {
  constructor() {
    // map of event name to arrays of handlers for that event
    this[eventToHandlersMap] = new Map();
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
    const subscriptions = this[eventToHandlersMap].get(event);

    // if nobody registered to this event, return false
    if (!subscriptions || subscriptions.length === 0) {
      return false;
    }

    // publish all subscriptions
    // after each individual publish, cancel the subscription if it expired.
    subscriptions.forEach(sub => {
      sub.handler(...args);
      if (sub.isExpired()) {
        this.unsubscribeHandler(event, sub.handler);
      }
    });

    // if publish succeeded, return true
    return true;
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

    // initialize empty array of handlers for the given event, if necessary
    if (!this[eventToHandlersMap].has(event)) {
      this[eventToHandlersMap].set(event, []);
    }

    // unique symbol identifying this subscription
    const symbol = Symbol(event);

    // add current subscription object
    this[eventToHandlersMap].get(event).push(new Subscription({ symbol, handler, duration }));

    // return symbol representing this subscription
    return symbol;
  }

  /**
   * Cancel a subscription using the subscription symbol
   * @param  {Symbol} symbol subscription symbol
   * @return {Boolean} boolean that is true if subscription was cancelled, false otherwise
   */
  unsubscribe(symbol) {
    _assertSymbol(symbol);

    // iterate through all event handlers
    for (const [event, handlers] of this[eventToHandlersMap].entries()) {
      // iterate through all handler for particular event
      for (const [idx, { symbol: existingSymbol }] of handlers.entries()) {
        // if symbol represents an existing subscription, remove it
        if (existingSymbol === symbol) {
          handlers.splice(idx, 1);
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
    if (!this[eventToHandlersMap].has(event)) {
      return false;
    }

    // extract all handlers for current event
    const handlers = this[eventToHandlersMap].get(event);

    // if a matching handler is found, remove it and return true
    for (const h of handlers) {
      if (h === handler) {
        handlers.splice(idx, 1);
        return true;
      }
    }

    // return false if a subscription matching given event&handler pair couldn't be found.
    return false;
  }
}

export default PubSub;