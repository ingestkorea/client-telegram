import { TelegramClientResolvedConfig } from "../TelegramClient";
import {
  TelegramCommand,
  GetBotInfoRequest,
  GetBotInfoResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models";
import { se_GetBotInfoCommand, de_GetBotInfoCommand } from "../protocols/GetBotInfo";

export interface GetBotInfoCommandInput extends GetBotInfoRequest {}
export interface GetBotInfoCommandOutput extends MetadataBearer, GetBotInfoResult {}

export class GetBotInfoCommand extends TelegramCommand<
  GetBotInfoCommandInput,
  GetBotInfoCommandOutput,
  TelegramClientResolvedConfig
> {
  input: GetBotInfoCommandInput;
  serializer: RequestSerializer<GetBotInfoCommandInput, TelegramClientResolvedConfig>;
  deserializer: ResponseDeserializer<GetBotInfoCommandOutput, TelegramClientResolvedConfig>;
  constructor(input: GetBotInfoCommandInput) {
    super(input);
    this.input = {};
    this.serializer = se_GetBotInfoCommand;
    this.deserializer = de_GetBotInfoCommand;
  }
}
