import { HttpRequest } from "@ingestkorea/util-http-handler";
import { TelegramClientResolvedConfig } from "../TelegramClient";
import { ListUpdatesCommandInput, ListUpdatesCommandOutput } from "../commands/ListUpdatesCommand";
import { RequestSerializer, ResponseDeserializer, ListUpdatesResult, UpdateInfo } from "../models";
import { parseBody, parseErrorBody, deserializeMetadata, _json } from "./constants";
import { de_Message } from "./SendMessage";

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
  if (response.statusCode >= 300) await parseErrorBody(response);

  let data = await parseBody(response);
  let contents: any = {};
  contents = _json(de_ListUpdatesResult(data));

  return {
    $metadata: deserializeMetadata(response),
    ...contents,
  };
};

const de_ListUpdatesResult = (output: any): ListUpdatesResult => {
  return {
    ok: output.ok != null ? output.ok : undefined,
    result: output.result != null ? de_UpdateInfoList(output.result) : undefined,
  };
};

const de_UpdateInfoList = (output: any[]): UpdateInfo[] => {
  return (output || []).filter((e) => e != null).map((entry) => de_UpdateInfo(entry));
};

const de_UpdateInfo = (output: any): UpdateInfo => {
  return {
    update_id: output.update_id ? output.update_id : undefined,
    message: output.message ? de_Message(output.message) : undefined,
  };
};
