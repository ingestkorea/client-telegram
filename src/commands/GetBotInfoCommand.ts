import { TelegramClientResolvedConfig } from "../TelegramClient.js";
import {
  TelegramCommand,
  GetBotInfoRequest,
  GetBotInfoResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
} from "../models/index.js";
import { se_GetBotInfoCommand, de_GetBotInfoCommand } from "../protocols/index.js";

export type GetBotInfoCommandInput = GetBotInfoRequest;
export type GetBotInfoCommandOutput = MetadataBearer & GetBotInfoResult;

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
