import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { TelegramClientResolvedConfig } from "../TelegramClient";
import { TelegramCommand, SendMessageInput, SendMessageOutput } from "../models";
import {
  serializeIngestkorea_restJson_SendMessageCommand,
  deserializeIngestkorea_restJson_SendMessageCommand,
} from "../protocols";

export interface SendMessageCommandInput extends SendMessageInput {}
export interface SendMessageCommandOutput extends SendMessageOutput {}

export class SendMessageCommand extends TelegramCommand<
  SendMessageCommandInput,
  SendMessageCommandOutput,
  TelegramClientResolvedConfig
> {
  input: SendMessageCommandInput;
  constructor(input: SendMessageCommandInput) {
    super(input);
    this.input = {
      ...input,
    };
  }
  async serialize(input: SendMessageCommandInput, config: TelegramClientResolvedConfig): Promise<HttpRequest> {
    let request = await serializeIngestkorea_restJson_SendMessageCommand(input, config);
    return request;
  }
  async deserialize(response: HttpResponse): Promise<SendMessageCommandOutput> {
    let output = await deserializeIngestkorea_restJson_SendMessageCommand(response);
    return output;
  }
}
