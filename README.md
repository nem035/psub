# PubSub in ES6

Implementation of the [Publish/Subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) design pattern using ES6 features.

## What is Publish/Subscribe?

It is an event system that allows us to define application specific events which can serve as triggers for message passing between various parts of an application. The main idea here is to avoid dependencies and promote [loose coupling](https://en.wikipedia.org/wiki/Loose_coupling). Rather than single objects calling on the methods of other objects directly, they instead subscribe to a specific topic (event) and are notified when it occurs.

## features

- ES6 [Symbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) as subscription tokens
- Constant subscribing/unsubscribing time
- Publish in chronological (FIFO) order
- 100% test coverage
- Asynchronous publishing with [Promises](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

## Example

[Demo Page](https://nem035.github.io/pub-sub-es6)

```js
const pubsub = new PubSub();
pubsub.subscribe('email/inbox', ({
  subject,
  body
}) => {
  new Notification(`Email: ${subject}`, {
    body
  });
});

function publishEmail(email) {
  pubsub.publish('email/inbox', email);
}

document
  .querySelector('#send')
  .addEventListener('click', () => {
    const subject = document.querySelector('#subject').value;
    const body = document.querySelector('#body').value;
    publishEmail({
      subject,
      body
    });
  });
```

## API

<a name="PubSub"></a>

## PubSub
Class representing a PubSub object

**Kind**: global class

* [PubSub](#PubSub)
    * [new PubSub()](#new_PubSub_new)
    * [.subscribe(topic, handler, invocationsLeft)](#PubSub+subscribe) ⇒ <code>Symbol</code>
    * [.publish(topic, ...args)](#PubSub+publish) ⇒ <code>Boolean</code>
    * [.unsubscribe()](#PubSub+unsubscribe) ⇒ <code>Boolean</code>
    * [.unsubscribeSymbol(symbol)](#PubSub+unsubscribeSymbol) ⇒ <code>Boolean</code>
    * [.unsubscribeHandler(topic, handler)](#PubSub+unsubscribeHandler) ⇒ <code>Boolean</code>

<a name="new_PubSub_new"></a>

### new PubSub()
Create a PubSub instance.

<a name="PubSub+subscribe"></a>

### pubSub.subscribe(topic, handler, invocationsLeft) ⇒ <code>Symbol</code>
Subscribes the given handler for the given topic.
You can pass an optional integer to indicate max
amount of invocations before auto unsubscribing.
Default value is Infinity.

**Kind**: instance method of <code>[PubSub](#PubSub)</code>
**Returns**: <code>Symbol</code> - Symbol that can be used to unsubscribe this subscription

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>String</code> | Topic name for which to subscribe the given handler |
| handler | <code>function</code> | Function to call when given topic is published |
| invocationsLeft | <code>Number</code> | Optional integer denoting how many invocations can happen before automatically unsubscribing |

**Example**
```js
const subscription = pubsub.subscribe('message', onMessage);

// subscribe for a single publish event
const singleSubscription = pubsub.subscribe(
  'notifications', // topic name
  onNotification,  // callback
  1                // max invokation amount for the callback
);
```
<a name="PubSub+publish"></a>

### pubSub.publish(topic, ...args) ⇒ <code>Boolean</code>
Method to publish data to all subscribers for the given topic.

**Kind**: instance method of <code>[PubSub](#PubSub)</code>
**Returns**: <code>Boolean</code> - Boolean that's true if publish succeeded, false otherwise

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>String</code> | Topic for |
| ...args | <code>Array</code> | Arguments to send to all subscribers for this topic |

**Example**
```js
const didPublish = pubsub.publish('message/channel', {
  id: '31#fxxx',
  content: 'PubSub is cool!'
})
```
<a name="PubSub+unsubscribe"></a>

### pubSub.unsubscribe() ⇒ <code>Boolean</code>
Delegates unsubscribing to appropriate method based on argument count.

**Kind**: instance method of <code>[PubSub](#PubSub)</code>
**Returns**: <code>Boolean</code> - true if unsubscribe succeeded, false otherwise
**Example**
```js
const didUnsubscribe = pubsub.unsubscribe(subscriptionSymbol);
// or
const didUnsubscribe = pubsub.unsubscribe('message', onMessage);
```
<a name="PubSub+unsubscribeSymbol"></a>

### pubSub.unsubscribeSymbol(symbol) ⇒ <code>Boolean</code>
Cancel a subscription using the subscription symbol

**Kind**: instance method of <code>[PubSub](#PubSub)</code>
**Returns**: <code>Boolean</code> - true if subscription was cancelled, false otherwise

| Param | Type | Description |
| --- | --- | --- |
| symbol | <code>Symbol</code> | subscription Symbol obtained when subscribing |

**Example**
```js
const didUnsubscribe = pubsub.unsubscribe(subscriptionSymbol);
```
<a name="PubSub+unsubscribeHandler"></a>

### pubSub.unsubscribeHandler(topic, handler) ⇒ <code>Boolean</code>
Unsubscribe using the same topic name and handler when first subscribed.

**Kind**: instance method of <code>[PubSub](#PubSub)</code>
**Returns**: <code>Boolean</code> - true if subscription was cancelled, false otherwise

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>String</code> | Topic name from which to unsubscribe |
| handler | <code>function</code> | Function handler that will be unsubscribed |

**Example**
```js
const didUnsubscribe = pubsub.unsubscribe('message', onMessage);
```
<a name="_assertValidTopic"></a>

## _assertValidTopic(topic)
Assert method to validate topic as a non-empty string.

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>String</code> | topic name |

<a name="_assertValidTopicAndHandler"></a>

## _assertValidTopicAndHandler(topic, handler)
Assert method to validate topic as a non-empty string
and handler as a function.

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>String</code> | topic name |
| handler | <code>function</code> | handler function |

<a name="_assertSymbol"></a>

## _assertSymbol(symbol)
Assert method to a symbol.

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| symbol | <code>Symbol</code> | symbol that will be validated |
