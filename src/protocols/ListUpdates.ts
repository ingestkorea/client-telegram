import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  TelegramClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  ListUpdatesResult,
  UpdateInfo,
  TelegramClientError,
} from "../models/index.js";
import { ListUpdatesCommandInput, ListUpdatesCommandOutput } from "../commands/ListUpdatesCommand.js";
import { deserializeMetadata, parseBody, parseErrorBody, compact } from "./constants.js";
import { de_Message } from "./SendMessage.js";

export const se_ListUpdatesCommand: RequestSerializer<ListUpdatesCommandInput, TelegramClientResolvedConfig> = async (
  input,
  config,
) => {
  const { token } = config.credentials;
  const hostname = "api.telegram.org";
  const path = "/bot" + token + "/getUpdates";
  const headers = { "content-type": "application/json; charset=utf-8" };
  const body = JSON.stringify(input);

  const telegramTimeoutMs = (input.timeout ?? 0) * 1000;

  if (telegramTimeoutMs >= config.httpHandler.socketTimeout) {
    throw new TelegramClientError({
      statusCode: -1,
      code: "SDK.GENERAL_ERROR",
      message:
        `[InvalidTimeout] ListUpdatesCommand timeout (${input.timeout ?? 0}s) ` +
        `must be shorter than TelegramClient socketTimeout (${config.httpHandler.socketTimeout / 1000}s).`,
    });
  }

  return new HttpRequest({
    protocol: "https:",
    method: "POST",
    hostname,
    path,
    headers,
    body,
  });
};

export const de_ListUpdatesCommand: ResponseDeserializer<
  ListUpdatesCommandOutput,
  TelegramClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_ListUpdatesResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

const de_ListUpdatesResult = (output: any): ListUpdatesResult => {
  return {
    ok: true,
    result: output.result ? de_UpdateInfoList(output.result) : [],
  };
};

const de_UpdateInfoList = (output: any[]): UpdateInfo[] => {
  return (output || []).filter((e) => e != null).map((entry) => de_UpdateInfo(entry));
};

const de_UpdateInfo = (output: any): UpdateInfo => {
  return {
    update_id: output.update_id,
    message: output.message ? de_Message(output.message) : undefined,
  };
};
