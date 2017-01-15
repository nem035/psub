/**
 * Assert method to validate topic as a non-empty string.
 *
 * @param {String} topic topic name
 */
function assertValidTopic(topic) {
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
function assertValidTopicAndHandler(topic, handler) {
  assertValidTopic(topic);
  if (typeof handler !== 'function') {
    throw new TypeError('Handler must be a function.');
  }
}

/**
 * Assert argument is a symbol.
 *
 * @param {Symbol} symbol symbol that will be validated
 */
function assertSymbol(symbol) {
  if (typeof symbol !== 'symbol') {
    throw new TypeError('Argument must be a symbol');
  }
}

export {
  assertValidTopic,
  assertValidTopicAndHandler,
  assertSymbol,
};
