import { TelegramClientResolvedConfig } from "../TelegramClient.js";
import {
  TelegramCommand,
  DeleteWebhookRequest,
  DeleteWebhookResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models/index.js";
import { se_DeleteWebhookCommand, de_DeleteWebhookCommand } from "../protocols/index.js";

export type DeleteWebhookCommandInput = DeleteWebhookRequest;
export type DeleteWebhookCommandOutput = MetadataBearer & DeleteWebhookResult;

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
