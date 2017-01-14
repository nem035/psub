# PubSub in ES6

Implementation of the [Publish/Subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) design pattern using ES6 features.

## Examples

```js
const pubsub = new PubSub();
pubsub.subscribe('email/inbox', ({ subject, body }) => {
  new Notification(`Email: ${subject}`, { body });
});

function notifyOfEmail(email) {
  pubsub.publish('email/inbox', email);
}, 1000);

document.querySelector('#send', () => {
  const subject = document.querySelector('#subject').value;
  const body = document.querySelector('#body').value;
  notifyOfEmail({
    subject,
    body
  });
});
## API


