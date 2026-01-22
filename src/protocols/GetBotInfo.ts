import { HttpRequest } from "@ingestkorea/util-http-handler";
import { TelegramClientResolvedConfig } from "../TelegramClient.js";
import { parseBody, isSuccess, deserializeMetadata, _json } from "./constants.js";
import { RequestSerializer, ResponseDeserializer, GetBotInfoResult, BotInfo } from "../models/index.js";
import { GetBotInfoCommandInput, GetBotInfoCommandOutput } from "../commands/index.js";

export const se_GetBotInfoCommand: RequestSerializer<GetBotInfoCommandInput, TelegramClientResolvedConfig> = async (
  input,
  config
) => {
  const { credentials } = config;
  const hostname = "api.telegram.org";
  const path = "/bot" + credentials.token + "/getMe";
  const headers = {};
  return new HttpRequest({
    protocol: "https:",
    method: "GET",
    hostname: hostname,
    path: path,
    headers: headers,
  });
};

export const de_GetBotInfoCommand: ResponseDeserializer<GetBotInfoCommandOutput, TelegramClientResolvedConfig> = async (
  response,
  config
) => {
  const $metadata = deserializeMetadata(response);

  const raw = await parseBody(response);
  const data = isSuccess<any>(raw);

  const content: GetBotInfoResult = {
    ok: true,
    result: de_BotInfo(data.result),
    description: data.description,
  };

  return {
    $metadata,
    ..._json(content),
  };
};

const de_BotInfo = (output: any): BotInfo => {
  return {
    id: output.id,
    is_bot: output.is_bot,
    first_name: output.first_name,
    username: output.username,
    can_join_groups: output.can_join_groups,
    can_read_all_group_messages: output.can_read_all_group_messages,
    supports_inline_queries: output.supports_inline_queries,
    can_connect_to_business: output.can_connect_to_business,
    has_main_web_app: output.has_main_web_app,
  };
};
