# tmi-utils
JavaScript utilities for Twitch chat with tmi.js

This utility includes a message parser for the emote object provided by [tmi.js](https://tmijs.com/) on every chat message.

## Install
`npm i tmi-utils`

## Example Usage
```js
import tmi from 'tmi.js';
import { getEmoteAsUrl, parseEmotesInMessage } from 'tmi-utils';

const client = new tmi.Client({ /* tmi options */ });
client.connect();

client.on('message', (channel, tags, message, self) => {
  // The emotes object is a mapping of emote id to a list
  // of it's positions in the message string. For example,
  //
  // message: staying on the map is hard LUL LUL wow
  // emotes : { 425618: ['27-29', '31-33'] }
  const { emotes } = tags

  // `parseEmotesInMessage` splits the message up into strings and emotes
  const parsedMessage = parseEmotesInMessage(emotes, message);

  // Then you can render the message with emotes however you like
  const message = document.createElement('span');

  // Safely append each part
  parsedMessage.forEach(({ type, value, raw }) => {
    if (type === 'emote') {
      const img = new Image();
      img.src = getEmoteAsUrl(value);
      img.alt = raw;
      img.title = raw;

      message.append(img);
    } else {
      message.append(value);
    }
  });

  document.querySelector('.message-list').append(message)
})
```
