import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  TelegramClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  DeleteWebhookResult,
} from "../models/index.js";
import { DeleteWebhookCommandInput, DeleteWebhookCommandOutput } from "../commands/DeleteWebhookCommand.js";
import { deserializeMetadata, parseBody, parseErrorBody, compact } from "./constants.js";

export const se_DeleteWebhookCommand: RequestSerializer<
  DeleteWebhookCommandInput,
  TelegramClientResolvedConfig
> = async (input, config) => {
  const { token } = config.credentials;
  const hostname = "api.telegram.org";
  const path = "/bot" + token + "/deleteWebhook";
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

export const de_DeleteWebhookCommand: ResponseDeserializer<
  DeleteWebhookCommandOutput,
  TelegramClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_DeleteWebhookResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

const de_DeleteWebhookResult = (output: any): DeleteWebhookResult => {
  return {
    ok: true,
    result: output.result || true,
    description: output.description ? output.description : undefined,
  };
};
