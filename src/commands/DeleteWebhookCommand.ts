import { TelegramClientResolvedConfig } from "../TelegramClient";
import {
  TelegramCommand,
  DeleteWebhookRequest,
  DeleteWebhookResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models";
import { se_DeleteWebhookCommand, de_DeleteWebhookCommand } from "../protocols/DeleteWebhook";

export interface DeleteWebhookCommandInput extends DeleteWebhookRequest {}
export interface DeleteWebhookCommandOutput extends MetadataBearer, DeleteWebhookResult {}

export class DeleteWebhookCommand extends TelegramCommand<
  DeleteWebhookCommandInput,
  DeleteWebhookCommandOutput,
  TelegramClientResolvedConfig
> {
  input: DeleteWebhookCommandInput;
  serializer: RequestSerializer<DeleteWebhookCommandInput, TelegramClientResolvedConfig>;
  deserializer: ResponseDeserializer<DeleteWebhookCommandOutput, TelegramClientResolvedConfig>;
  constructor(input: DeleteWebhookCommandInput) {
    super(input);
    this.input = {
      drop_pending_updates: input.drop_pending_updates ? input.drop_pending_updates : false,
    };
    this.serializer = se_DeleteWebhookCommand;
    this.deserializer = de_DeleteWebhookCommand;
  }
}
