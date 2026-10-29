import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  TelegramClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  GetBotInfoResult,
  BotInfo,
} from "../models/index.js";
import { GetBotInfoCommandInput, GetBotInfoCommandOutput } from "../commands/GetBotInfoCommand.js";
import { deserializeMetadata, parseBody, parseErrorBody, compact } from "./constants.js";

export const se_GetBotInfoCommand: RequestSerializer<GetBotInfoCommandInput, TelegramClientResolvedConfig> = async (
  input,
  config,
) => {
  const { token } = config.credentials;
  const hostname = "api.telegram.org";
  const path = "/bot" + token + "/getMe";
  const headers = {};

  return new HttpRequest({
    protocol: "https:",
    method: "GET",
    hostname,
    path,
    headers,
  });
};

export const de_GetBotInfoCommand: ResponseDeserializer<GetBotInfoCommandOutput, TelegramClientResolvedConfig> = async (
  response,
  config,
) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_GetBotInfoResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

const de_GetBotInfoResult = (output: any): GetBotInfoResult => {
  return {
    ok: true,
    result: output.result ? de_BotInfo(output.result) : {},
  };
};

const de_BotInfo = (output: any): BotInfo => {
  return {
    id: output.id ? output.id : undefined,
    is_bot: output.is_bot ?? undefined,
    first_name: output.first_name ? output.first_name : undefined,
    username: output.username ? output.username : undefined,
    can_join_groups: output.can_join_groups ?? undefined,
    can_read_all_group_messages: output.can_read_all_group_messages ?? undefined,
    can_connect_to_business: output.can_connect_to_business ?? undefined,
    can_manage_bots: output.can_manage_bots ?? undefined,
    has_main_web_app: output.has_main_web_app ?? undefined,
    has_topics_enabled: output.has_topics_enabled ?? undefined,
    allows_users_to_create_topics: output.allows_users_to_create_topics ?? undefined,
    supports_inline_queries: output.supports_inline_queries ?? undefined,
    supports_guest_queries: output.supports_guest_queries ?? undefined,
    supports_join_request_queries: output.supports_join_request_queries ?? undefined,
  };
};
