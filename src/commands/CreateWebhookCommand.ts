import { TelegramClientResolvedConfig } from "../TelegramClient";
import {
  TelegramCommand,
  CreateWebhookRequest,
  CreateWebhookResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models";
import { se_CreateWebhookCommand, de_CreateWebhookCommand } from "../protocols/CreateWebhook";

export interface CreateWebhookCommandInput extends CreateWebhookRequest {}
export interface CreateWebhookCommandOutput extends MetadataBearer, CreateWebhookResult {}

export class CreateWebhookCommand extends TelegramCommand<
  CreateWebhookCommandInput,
  CreateWebhookCommandOutput,
  TelegramClientResolvedConfig
> {
  input: CreateWebhookCommandInput;
  serializer: RequestSerializer<CreateWebhookCommandInput, TelegramClientResolvedConfig>;
  deserializer: ResponseDeserializer<CreateWebhookCommandOutput, TelegramClientResolvedConfig>;
  constructor(input: CreateWebhookCommandInput) {
    super(input);
    if (!input.url) throw new Error("url undefined. Use an DeleteWebhookCommand to remove webhook integration.");

    this.input = {
      url: input.url,
      max_connections: input.max_connections && input.max_connections <= 100 ? input.max_connections : 40,
      allowed_updates: input.allowed_updates && input.allowed_updates.length ? input.allowed_updates : ["message"],
      drop_pending_updates: input.drop_pending_updates ? input.drop_pending_updates : false,
      ...(input.secret_token && { secret_token: input.secret_token }),
    };
    this.serializer = se_CreateWebhookCommand;
    this.deserializer = de_CreateWebhookCommand;
  }
}
