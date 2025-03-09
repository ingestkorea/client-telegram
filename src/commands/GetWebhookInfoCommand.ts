import { TelegramClientResolvedConfig } from "../TelegramClient";
import {
  TelegramCommand,
  GetWebhookInfoRequest,
  GetWebhookInfoResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models";
import { se_GetWebhookInfoCommand, de_GetWebhookInfoCommand } from "../protocols/GetWebhookInfo";

export interface GetWebhookInfoCommandInput extends GetWebhookInfoRequest {}
export interface GetWebhookInfoCommandOutput extends MetadataBearer, GetWebhookInfoResult {}

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
