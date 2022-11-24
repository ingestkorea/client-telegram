# @ingestkorea/client-telegram

## Description
INGESTKOREA SDK Telegram Client for Node.js.

## Installing
```sh
npm install @ingestkorea/client-telegram
```

## Getting Started

### Support Methods
+ sendMessage

### Import
```ts
import { TelegramClient, SendMessageCommand, SendMessageCommandInput } from '@ingestkorea/client-telegram';
```

### Usage
To send a request, you:
+ Initiate client with configuration.
+ Initiate command with input parameters.
+ Call `send` operation on client with command object as input.


```ts
// a client can be shared by different commands.
const client = new TelegramClient({
    credentials: {
        token: TOKEN, // 1234xxx:ABCDEFGxxx
        chatId: CHAT_ID // 5678xxx (string)
    }
});

const input: SendMessageCommandInput = {
    text: 'hello client-telegram',
};
const command = new SendMessageCommand(input);
```

#### Async/await
```ts
(async () => {
    try {
        const data = await client.send(command);
        console.log(data)
    } catch (err){
        console.log(err)
    }
})();
```

#### Promises
```ts
client.send(command)
    .then(data => console.log(data))
    .catch(err => console.log(err));
```

## License
This SDK is distributed under the [MIT License](https://opensource.org/licenses/MIT), see LICENSE for more information.
