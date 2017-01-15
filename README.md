# PSub [![Build Status](https://travis-ci.org/nem035/psub.svg?branch=master)](https://travis-ci.org/nem035/psub) [![Codecov branch](https://img.shields.io/codecov/c/github/nem035/psub/master.svg)]()

Implementation of the [Publish/Subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) design pattern using ES6 features.

## What is Publish/Subscribe?

It is an event system that allows us to define application specific events which can serve as triggers for message passing between various parts of an application. The main idea here is to avoid dependencies and promote [loose coupling](https://en.wikipedia.org/wiki/Loose_coupling). Rather than single objects calling on the methods of other objects directly, they instead subscribe to a specific topic (event) and are notified when it occurs.

## Features

- ES6 [Symbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) as subscription tokens
- Constant O(1) subscribing/unsubscribing time
- Publish in chronological (FIFO) order
- 100% test coverage
- Asynchronous publishing with [microtasks](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

## Example

```js
const ps = new PSub();
ps.subscribe('email/inbox', ({
  subject,
  body
}) => {
  new Notification(`Sent: ${subject}`, {
    body
  });
});

document
  .querySelector('#send')
  .addEventListener('click', () => {
    const form = new FormData(document.getElementById('email-form'));
    fetch('/login', {
      method: 'POST',
      body: form
    }).then((response) => {
      ps.publish('email/inbox', response);
    });
  });
```

## API

<a name="PSub"></a>

## PSub
Class representing a PSub object

**Kind**: global class

* [PSub](#PSub)
    * [new PSub()](#new_PSub_new)
    * [.subscribe(topic, handler)](#PSub+subscribe) ⇒ <code>Symbol</code>
    * [.publish(topic, ...args)](#PSub+publish) ⇒ <code>Boolean</code>
    * [.unsubscribe(symbol)](#PSub+unsubscribe) ⇒ <code>Boolean</code>

<a name="new_PSub_new"></a>

### new PSub()
Create a PSub instance.

<a name="PSub+subscribe"></a>

### pSub.subscribe(topic, handler) ⇒ <code>Symbol</code>
Subscribes the given handler for the given topic.

**Kind**: instance method of <code>[PSub](#PSub)</code><br />
**Returns**: <code>Symbol</code> - Symbol that can be used to unsubscribe this subscription

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>String</code> | Topic name for which to subscribe the given handler |
| handler | <code>function</code> | Function to call when given topic is published |

**Example**
```js
// subscribe for the topic "notifications"
// call onNotification when a message arrives
const subscription = psub.subscribe(
  'notifications', // topic name
  onNotification,  // callback
);
```
<a name="PSub+publish"></a>

### pSub.publish(topic, ...args) ⇒ <code>Boolean</code>
Method to publish data to all subscribers for the given topic.

**Kind**: instance method of <code>[PSub](#PSub)</code><br />
**Returns**: <code>Boolean</code> - true if publish succeeded, false otherwise

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>String</code> | cubscription topic |
| ...args | <code>Array</code> | arguments to send to all subscribers for this topic |

**Example**
```js
// publish an object to anybody listening
// to the topic 'message/channel'
const didPublish = psub.publish('message/channel', {
  id: 1,
  content: 'PSub is cool!'
})
```
<a name="PSub+unsubscribe"></a>

### pSub.unsubscribe(symbol) ⇒ <code>Boolean</code>
Cancel a subscription using the subscription symbol

**Kind**: instance method of <code>[PSub](#PSub)</code><br />
**Returns**: <code>Boolean</code> - true if subscription was cancelled, false otherwise

| Param | Type | Description |
| --- | --- | --- |
| symbol | <code>Symbol</code> | subscription Symbol obtained when subscribing |

**Example**
```js
// unsubscribe using the subscription symbol
// obtained when you subscribed
const didUnsubscribe = psub.unsubscribe(subscriptionSymbol);
```

