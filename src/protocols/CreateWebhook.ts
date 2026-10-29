import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  TelegramClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  CreateWebhookResult,
} from "../models/index.js";
import { CreateWebhookCommandInput, CreateWebhookCommandOutput } from "../commands/CreateWebhookCommand.js";
import { deserializeMetadata, parseBody, parseErrorBody, compact } from "./constants.js";

export const se_CreateWebhookCommand: RequestSerializer<
  CreateWebhookCommandInput,
  TelegramClientResolvedConfig
> = async (input, config) => {
  const { token } = config.credentials;
  const hostname = "api.telegram.org";
  const path = "/bot" + token + "/setWebhook";
  const headers = { "content-type": "application/json; charset=utf-8" };
  const body = JSON.stringify(input);

  return new HttpRequest({
    protocol: "https:",
    method: "POST",
    hostname,
    path,
    headers,
    body,
  });
};

export const de_CreateWebhookCommand: ResponseDeserializer<
  CreateWebhookCommandOutput,
  TelegramClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_CreateWebhookResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

const de_CreateWebhookResult = (output: any): CreateWebhookResult => {
  return {
    ok: true,
    result: output.result || true,
    description: output.description ? output.description : undefined,
  };
};
