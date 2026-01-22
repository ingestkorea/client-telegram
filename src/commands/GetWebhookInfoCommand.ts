import { TelegramClientResolvedConfig } from "../TelegramClient.js";
import {
  TelegramCommand,
  GetWebhookInfoRequest,
  GetWebhookInfoResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models/index.js";
import { se_GetWebhookInfoCommand, de_GetWebhookInfoCommand } from "../protocols/index.js";

export type GetWebhookInfoCommandInput = GetWebhookInfoRequest;
export type GetWebhookInfoCommandOutput = MetadataBearer & GetWebhookInfoResult;

export class GetWebhookInfoCommand extends TelegramCommand<
  GetWebhookInfoCommandInput,
  GetWebhookInfoCommandOutput,
  TelegramClientResolvedConfig
> {
  input: GetWebhookInfoCommandInput;
  serializer: RequestSerializer<GetWebhookInfoCommandInput, TelegramClientResolvedConfig>;
  deserializer: ResponseDeserializer<GetWebhookInfoCommandOutput, TelegramClientResolvedConfig>;
  constructor(input: GetWebhookInfoCommandInput) {
    super(input);
    this.input = {
      ...input,
    };
    this.serializer = se_GetWebhookInfoCommand;
    this.deserializer = de_GetWebhookInfoCommand;
  }
}
