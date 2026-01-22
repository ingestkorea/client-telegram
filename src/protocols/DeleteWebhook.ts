import { HttpRequest } from "@ingestkorea/util-http-handler";
import { TelegramClientResolvedConfig } from "../TelegramClient.js";
import { parseBody, isSuccess, deserializeMetadata, _json } from "./constants.js";
import { RequestSerializer, ResponseDeserializer, DeleteWebhookResult } from "../models/index.js";
import { DeleteWebhookCommandInput, DeleteWebhookCommandOutput } from "../commands/index.js";

export const se_DeleteWebhookCommand: RequestSerializer<
  DeleteWebhookCommandInput,
  TelegramClientResolvedConfig
> = async (input, config) => {
  const { token } = config.credentials;
  const hostname = "api.telegram.org";
  const path = "/bot" + token + "/deleteWebhook";
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

export const de_DeleteWebhookCommand: ResponseDeserializer<
  DeleteWebhookCommandOutput,
  TelegramClientResolvedConfig
> = async (response, config) => {
  const $metadata = deserializeMetadata(response);

  const raw = await parseBody(response);
  const data = isSuccess<any>(raw);

  const content: DeleteWebhookResult = {
    ok: true,
    result: data.result,
    description: data.description,
  };

  return {
    $metadata,
    ..._json(content),
  };
};
