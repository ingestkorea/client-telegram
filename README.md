# @ingestkorea/client-telegram

[![npm (scoped)](https://img.shields.io/npm/v/@ingestkorea/client-telegram?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-telegram)
[![NPM downloads](https://img.shields.io/npm/dm/@ingestkorea/client-telegram?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-telegram)
[![license](https://img.shields.io/github/license/ingestkorea/client-telegram?style=flat-square)](https://www.npmjs.com/package/@ingestkorea/client-telegram)

## Description

INGESTKOREA SDK - Telegram Client for Node.js.

INGESTKOREA SDK - Telegram Client for Node.js is a lightweight library that contains only the essential features frequently used in Telegram bots.

This SDK performs tasks such as the following automatically.

- Authentication using an Bot User OAuth Token
- Retry requests
- Handle error responses

## Installing

```sh
npm install @ingestkorea/client-telegram
```

## Getting Started

### Pre-requisites

[Telegram](https://core.telegram.org/bots/features#botfather)

- Create a bot, then generate an authentication token for your new bot.

Node.js

- Use TypeScript v6.x
- Includes the TypeScript definitions for node.

  ```sh
  npm install -D @types/node # save dev mode
  ```

### Support Commands

- SendMessage
- GetBotInfo
- GetWebhookInfo
- CreateWebhook
- DeleteWebhook
- ListUpdates

### Import

The INGESTKOREA SDK - Telegram Client is modulized by `client` and `commands`.

To send a request, you only need to import the TelegramClient and the commands you need, for example SendMessageCommand:

```ts
import { TelegramClient, SendMessageCommand } from "@ingestkorea/client-telegram";
```

### Usage

To send a request, you:

- Initiate client with configuration.
- Initiate command with input parameters.
- Call `send` operation on client with command object as input.

```ts
import { TelegramClient, SendMessageCommand } from "@ingestkorea/client-telegram";

// a client can be shared by different commands.
const client = new TelegramClient({
  credentials: {
    token: "TOKEN" // required "0123456789:ABCDEFG",
    chatId: "CHAT_ID", // required // 9876543210
  },
});

const command = new SendMessageCommand({
  text: "hello client-telegram", // required
});

const output = await client.send(command);
```

#### GetBotInfo

```ts
import { GetBotInfoCommand } from "@ingestkorea/client-telegram";

const command = new GetBotInfoCommand({});
```

#### GetWebhookInfo

```ts
import { GetWebhookInfoCommand } from "@ingestkorea/client-telegram";

const command = new GetWebhookInfoCommand({});
```

#### CreateWebhook

- If you'd like to make sure that the webhook was set by you, you can specify secret data in the parameter secret_token. If specified, the request will contain a header `"X-Telegram-Bot-Api-Secret-Token"` with the secret token as content.
- You will not be able to receive updates using `ListUpdatesCommand` for as long as an outgoing webhook is set up.

```ts
import { CreateWebhookCommand } from "@ingestkorea/client-telegram";

const command = new CreateWebhookCommand({
  url: "https://webhook.my-domain.com", // required
});
```

#### DeleteWebhook

```ts
import { DeleteWebhookCommand } from "@ingestkorea/client-telegram";

const command = new DeleteWebhookCommand({});
```

#### ListUpdates

- Use this method to receive incoming updates using long polling.
- This method will not work if an outgoing webhook is set up.

```ts
import { ListUpdatesCommand } from "@ingestkorea/client-telegram";

const command = new ListUpdatesCommand({
  limit: 20, // optional (default: 20)
  timeout: 0, // optional (default: 0)
  offset: 12345, // optional (update_id + 1)
});
```

#### Async/await

We recommend using `await` operator to wait for the promise returned by send operation as follows:

```ts
import { TelegramClient, SendMessageCommand, TelegramClientError } from "@ingestkorea/client-telegram";

// a client can be shared by different commands.
const client = new TelegramClient({ ... });

(async () => {
  try {
    const command = new SendMessageCommand({ ... });
    const output = await client.send(command);
    console.dir(output, { depth: 5 });
  } catch (err) {
    if (err instanceof TelegramClientError) {
      ...
    } else {
      ....
    }
  }
})();
```

## Client Commands

### SendMessage

| Arguments                | Type                 | Required | Description                                                                                   |
| ------------------------ | -------------------- | -------- | --------------------------------------------------------------------------------------------- |
| text                     | string               | true     | Describe the content of the message.                                                          |
| chat_id                  | string or number     | false    | This chatId overrides TelegramClient config.                                                  |
| parse_mode               | ParseMode            | false    | Mode for parsing entities in the message text. (default: "MarkdownV2")                        |
| disable_web_page_preview | boolean              | false    | Disable the preview when there is a link in the text field. (default: false)                  |
| disable_notification     | boolean              | false    | Sends the message silently. Users will receive a notification with no sound. (default: false) |
| protect_content          | boolean              | false    | Protects the contents of the sent message from forwarding and saving. (default: false)        |
| reply_markup             | InlineKeyboardMarkup | false    | Additional interface options. object for an inline keyboard.                                  |

### CreateWebhook

| Arguments            | Type     | Required | Description                                                                                                                                                                                                                                               |
| -------------------- | -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| url                  | string   | true     | HTTPS URL to send updates to.                                                                                                                                                                                                                             |
| max_connections      | number   | false    | The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. (default: 50)                                                                                                                                     |
| allowed_updates      | string[] | false    | List of the update types you want your bot to receive. (default: ["message"])                                                                                                                                                                             |
| drop_pending_updates | boolean  | false    | Pass True to drop all pending updates. (default: false)                                                                                                                                                                                                   |
| secret_token         | string   | false    | A secret token to be sent in a header “X-Telegram-Bot-Api-Secret-Token” in every webhook request, 1-256 characters. Only characters A-Z, a-z, 0-9, \_ and - are allowed. The header is useful to ensure that the request comes from a webhook set by you. |

### DeleteWebhook

| Arguments            | Type    | Required | Description                                             |
| -------------------- | ------- | -------- | ------------------------------------------------------- |
| drop_pending_updates | boolean | false    | Pass True to drop all pending updates. (default: false) |

### ListUpdates

| Arguments | Type   | Required | Description                                                                                                                                  |
| --------- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| offset    | number | false    | Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. |
| limit     | number | false    | Limits the number of updates to be retrieved. Values between 1-100 are accepted. (default: 20)                                               |
| timeout   | number | false    | Timeout in seconds for long polling. (default: 0)                                                                                            |

## Types

### ParseMode

- "MarkdownV2"
- "HTML"
- "Markdown";

### InlineKeyboardMarkup

| Arguments       | Type                     | Required | Description                                                                           |
| --------------- | ------------------------ | -------- | ------------------------------------------------------------------------------------- |
| inline_keyboard | InlineKeyboardButton[][] | true     | Array of button rows, each represented by an Array of `InlineKeyboardButton` objects. |

### InlineKeyboardButton

| Arguments | Type   | Required | Description                                       |
| --------- | ------ | -------- | ------------------------------------------------- |
| text      | string | true     | Label text on the button.                         |
| url       | string | true     | HTTP URL to be opened when the button is pressed. |

## Getting Help

We use the GitHub issues for tracking bugs and feature requests.

If it turns out that you may have found a bug, please open an issue.

## License

This SDK is distributed under the [MIT License](https://opensource.org/licenses/MIT), see LICENSE for more information.
