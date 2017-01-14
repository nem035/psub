# PubSub in ES6

Implementation of the [Publish/Subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) design pattern using ES6 features.

## Examples

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
## API


