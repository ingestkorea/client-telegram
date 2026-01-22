import { TelegramClientResolvedConfig } from "../TelegramClient.js";
import {
  TelegramCommand,
  ListUpdatesRequest,
  ListUpdatesResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models/index.js";
import { se_ListUpdatesCommand, de_ListUpdatesCommand } from "../protocols/index.js";

export type ListUpdatesCommandInput = ListUpdatesRequest;
export type ListUpdatesCommandOutput = MetadataBearer & ListUpdatesResult;

export class ListUpdatesCommand extends TelegramCommand<
  ListUpdatesCommandInput,
  ListUpdatesCommandOutput,
  TelegramClientResolvedConfig
> {
  input: ListUpdatesCommandInput;
  serializer: RequestSerializer<ListUpdatesCommandInput, TelegramClientResolvedConfig>;
  deserializer: ResponseDeserializer<ListUpdatesCommandOutput, TelegramClientResolvedConfig>;
  constructor(input: ListUpdatesCommandInput) {
    super(input);
    this.input = {
      limit: input.limit && input.limit <= 100 ? input.limit : 20,
      timeout: input.timeout ? input.timeout : 0,
      ...(input.offset && { offset: input.offset }),
    };
    this.serializer = se_ListUpdatesCommand;
    this.deserializer = de_ListUpdatesCommand;
  }
}
