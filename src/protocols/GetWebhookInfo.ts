import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  TelegramClientResolvedConfig,
  RequestSerializer,
  ResponseDeserializer,
  GetWebhookInfoResult,
  WebhookInfo,
} from "../models/index.js";
import { GetWebhookInfoCommandInput, GetWebhookInfoCommandOutput } from "../commands/GetWebhookInfoCommand.js";
import { deserializeMetadata, parseBody, parseErrorBody, compact } from "./constants.js";

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
    hostname,
    path,
    headers,
  });
};

export const de_GetWebhookInfoCommand: ResponseDeserializer<
  GetWebhookInfoCommandOutput,
  TelegramClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_GetWebhookInfoResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

const de_GetWebhookInfoResult = (output: any): GetWebhookInfoResult => {
  return {
    ok: true,
    result: output.result ? de_WebhookInfo(output.result) : {},
  };
};

const de_WebhookInfo = (output: any): WebhookInfo => {
  return {
    url: output.url ? output.url : undefined,
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
