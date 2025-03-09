import { TelegramClientResolvedConfig } from "../TelegramClient";
import {
  TelegramCommand,
  ListUpdatesRequest,
  ListUpdatesResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models";
import { se_ListUpdatesCommand, de_ListUpdatesCommand } from "../protocols";

export interface ListUpdatesCommandInput extends ListUpdatesRequest {}
export interface ListUpdatesCommandOutput extends MetadataBearer, ListUpdatesResult {}

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
