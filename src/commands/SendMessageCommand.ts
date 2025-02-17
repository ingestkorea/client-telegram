import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { TelegramClientResolvedConfig } from "../TelegramClient";
import {
  TelegramCommand,
  SendMessageRequest,
  SendMessageResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models";
import { se_SendMessageCommand, de_SendMessageCommand } from "../protocols";

export interface SendMessageCommandInput extends SendMessageRequest {}
export interface SendMessageCommandOutput extends MetadataBearer, SendMessageResult {}

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
