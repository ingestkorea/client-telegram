import {
  TelegramClientResolvedConfig,
  TelegramCommand,
  SendMessageRequest,
  SendMessageResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models/index.js";
import { se_SendMessageCommand, de_SendMessageCommand } from "../protocols/index.js";

export type SendMessageCommandInput = SendMessageRequest;
export type SendMessageCommandOutput = MetadataBearer & SendMessageResult;

export class SendMessageCommand extends TelegramCommand<
  SendMessageCommandInput,
  SendMessageCommandOutput,
  TelegramClientResolvedConfig
> {
  input: SendMessageCommandInput;
  serializer: RequestSerializer<SendMessageCommandInput, TelegramClientResolvedConfig>;
  deserializer: ResponseDeserializer<SendMessageCommandOutput, TelegramClientResolvedConfig>;
  constructor(input: SendMessageCommandInput) {
    super(input);
    const chat_id = input.chatId || input.chat_id;

    this.input = {
      text: input.text,
      disable_web_page_preview: input.disable_web_page_preview ?? false,
      disable_notification: input.disable_notification ?? false,
      protect_content: input.protect_content ?? true,
      parse_mode: input.parse_mode ?? "HTML",
      ...(chat_id && { chat_id: chat_id }),
      ...(input.reply_markup && { reply_markup: input.reply_markup }),
    };

    if (input.chatId) {
      const message =
        "[SDK Warning] `chatId` is deprecated. Please use `chat_id` instead. " +
        "It will be completely removed in v1.7.0.";
      console.warn(message);
    }

    this.serializer = se_SendMessageCommand;
    this.deserializer = de_SendMessageCommand;
  }
}
