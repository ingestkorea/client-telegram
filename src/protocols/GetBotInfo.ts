import { HttpRequest } from "@ingestkorea/util-http-handler";
import { TelegramClientResolvedConfig } from "../TelegramClient";
import { GetBotInfoCommandInput, GetBotInfoCommandOutput } from "../commands/GetBotInfoCommand";
import { RequestSerializer, ResponseDeserializer, GetBotInfoResult, BotInfo } from "../models";
import { parseBody, parseErrorBody, deserializeMetadata, _json } from "./constants";

export const se_GetBotInfoCommand: RequestSerializer<GetBotInfoCommandInput, TelegramClientResolvedConfig> = async (
  input,
  config
) => {
  const { token } = config.credentials;
  const hostname = "api.telegram.org";
  const path = "/bot" + token + "/getMe";
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
  if (response.statusCode >= 300) await parseErrorBody(response);

  let data = await parseBody(response);
  let contents: any = {};
  contents = _json(de_GetBotInfoResult(data));

  return {
    $metadata: deserializeMetadata(response),
    ...contents,
  };
};

const de_GetBotInfoResult = (output: any): GetBotInfoResult => {
  return {
    ok: output.ok != null ? output.ok : undefined,
    result: output.result != null ? de_BotInfo(output.result) : undefined,
  };
};

const de_BotInfo = (output: any): BotInfo => {
  return {
    id: output.id != null ? output.id : undefined,
    is_bot: output.is_bot != null ? output.is_bot : undefined,
    first_name: output.first_name != null ? output.first_name : undefined,
    username: output.username != null ? output.username : undefined,
    can_join_groups: output.can_join_groups != null ? output.can_join_groups : undefined,
    can_read_all_group_messages:
      output.can_read_all_group_messages != null ? output.can_read_all_group_messages : undefined,
    supports_inline_queries: output.supports_inline_queries != null ? output.supports_inline_queries : undefined,
    can_connect_to_business: output.can_connect_to_business != null ? output.can_connect_to_business : undefined,
    has_main_web_app: output.has_main_web_app != null ? output.has_main_web_app : undefined,
  };
};
