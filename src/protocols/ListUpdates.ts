import { HttpRequest } from "@ingestkorea/util-http-handler";
import { TelegramClientResolvedConfig } from "../TelegramClient.js";
import { parseBody, isSuccess, deserializeMetadata, _json } from "./constants.js";
import { RequestSerializer, ResponseDeserializer, ListUpdatesResult, UpdateInfo } from "../models/index.js";
import { ListUpdatesCommandInput, ListUpdatesCommandOutput } from "../commands/index.js";
import { de_Message } from "./SendMessage.js";

export const se_ListUpdatesCommand: RequestSerializer<ListUpdatesCommandInput, TelegramClientResolvedConfig> = async (
  input,
  config
) => {
  const { token } = config.credentials;
  const hostname = "api.telegram.org";
  const path = "/bot" + token + "/getUpdates";
  const headers = { "content-type": "application/json; charset=utf-8" };
  const body = JSON.stringify({ ...input });
  return new HttpRequest({
    protocol: "https:",
    method: "POST",
    hostname: hostname,
    path: path,
    headers: headers,
    body: body,
  });
};

export const de_ListUpdatesCommand: ResponseDeserializer<
  ListUpdatesCommandOutput,
  TelegramClientResolvedConfig
> = async (response, config) => {
  const $metadata = deserializeMetadata(response);

  const raw = await parseBody(response);
  const data = isSuccess<any>(raw);

  const content: ListUpdatesResult = {
    ok: true,
    result: de_UpdateInfoList(data.result),
    description: data.description,
  };

  return {
    $metadata,
    ..._json(content),
  };
};

const de_UpdateInfoList = (output: any[]): UpdateInfo[] => {
  return (output || []).filter((e) => e != null).map((entry) => de_UpdateInfo(entry));
};

const de_UpdateInfo = (output: any): UpdateInfo => {
  return {
    update_id: output.update_id,
    message: de_Message(output.message),
  };
};
