import { HttpRequest } from "@ingestkorea/util-http-handler";
import { TelegramClientResolvedConfig } from "../TelegramClient.js";
import { parseBody, isSuccess, deserializeMetadata, _json } from "./constants.js";
import { RequestSerializer, ResponseDeserializer, GetWebhookInfoResult, WebhookInfo } from "../models/index.js";
import { GetWebhookInfoCommandInput, GetWebhookInfoCommandOutput } from "../commands/index.js";

export const se_GetWebhookInfoCommand: RequestSerializer<
  GetWebhookInfoCommandInput,
  TelegramClientResolvedConfig
> = async (input, config) => {
  const { token } = config.credentials;
  const hostname = "api.telegram.org";
  const path = "/bot" + token + "/getWebhookInfo";
  const headers = {};
  return new HttpRequest({
    protocol: "https:",
    method: "GET",
    hostname: hostname,
    path: path,
    headers: headers,
  });
};

export const de_GetWebhookInfoCommand: ResponseDeserializer<
  GetWebhookInfoCommandOutput,
  TelegramClientResolvedConfig
> = async (response, config) => {
  const $metadata = deserializeMetadata(response);

  const raw = await parseBody(response);
  const data = isSuccess<any>(raw);

  const content: GetWebhookInfoResult = {
    ok: true,
    result: de_WebhookInfo(data.result),
    description: data.description,
  };

  return {
    $metadata,
    ..._json(content),
  };
};

const de_WebhookInfo = (output: any): WebhookInfo => {
  return {
    url: output.url,
    has_custom_certificate: output.has_custom_certificate,
    pending_update_count: output.pending_update_count,
    max_connections: output.max_connections,
    ip_address: output.ip_address,
    last_error_date: output.last_error_date,
    last_error_message: output.last_error_message,
    last_synchronization_error_date: output.last_synchronization_error_date,
    allowed_updates: de_AllowedUpdateList(output.allowed_updates),
  };
};

const de_AllowedUpdateList = (output: any[]): string[] => {
  return (output || []).filter((e) => e != null);
};
