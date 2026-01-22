import { TelegramClientResolvedConfig } from "../TelegramClient.js";
import {
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
    this.input = {
      ...input,
    };
    this.serializer = se_SendMessageCommand;
    this.deserializer = de_SendMessageCommand;
  }
}
