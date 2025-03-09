import { HttpRequest } from "@ingestkorea/util-http-handler";
import { TelegramClientResolvedConfig } from "../TelegramClient";
import { CreateWebhookCommandInput, CreateWebhookCommandOutput } from "../commands/CreateWebhookCommand";
import { RequestSerializer, ResponseDeserializer, CreateWebhookResult } from "../models";
import { parseBody, parseErrorBody, deserializeMetadata, _json } from "./constants";

export const se_CreateWebhookCommand: RequestSerializer<
  CreateWebhookCommandInput,
  TelegramClientResolvedConfig
> = async (input, config) => {
  const { token } = config.credentials;
  const hostname = "api.telegram.org";
  const path = "/bot" + token + "/setWebhook";
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

export const de_CreateWebhookCommand: ResponseDeserializer<
  CreateWebhookCommandOutput,
  TelegramClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  let data = await parseBody(response);
  let contents: any = {};
  contents = _json(de_CreateWebhookResult(data));

  return {
    $metadata: deserializeMetadata(response),
    ...contents,
  };
};

const de_CreateWebhookResult = (output: any): CreateWebhookResult => {
  return {
    ok: output.ok != null ? output.ok : undefined,
    result: output.result != null ? output.result : undefined,
    description: output.description != null ? output.description : undefined,
  };
};
