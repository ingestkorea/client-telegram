import { HttpRequest } from "@ingestkorea/util-http-handler";
import { TelegramClientResolvedConfig } from "../TelegramClient";
import { GetWebhookInfoCommandInput, GetWebhookInfoCommandOutput } from "../commands/GetWebhookInfoCommand";
import { RequestSerializer, ResponseDeserializer, GetWebhookInfoResult, WebhookInfo } from "../models";
import { parseBody, parseErrorBody, deserializeMetadata, _json } from "./constants";

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
  if (response.statusCode >= 300) await parseErrorBody(response);

  let data = await parseBody(response);
  let contents: any = {};
  contents = _json(de_GetWebhookInfoResult(data));

  return {
    $metadata: deserializeMetadata(response),
    ...contents,
  };
};

const de_GetWebhookInfoResult = (output: any): GetWebhookInfoResult => {
  return {
    ok: output.ok != null ? output.ok : undefined,
    result: output.result != null ? de_WebhookInfo(output.result) : undefined,
  };
};

const de_WebhookInfo = (output: any): WebhookInfo => {
  return {
    url: output.url != null ? output.url : undefined,
    has_custom_certificate: output.has_custom_certificate != null ? output.has_custom_certificate : undefined,
    pending_update_count: output.pending_update_count != null ? output.pending_update_count : undefined,
    max_connections: output.max_connections != null ? output.max_connections : undefined,
    ip_address: output.ip_address != null ? output.ip_address : undefined,
    last_error_date: output.last_error_date != null ? output.last_error_date : undefined,
    last_error_message: output.last_error_message != null ? output.last_error_message : undefined,
    last_synchronization_error_date:
      output.last_synchronization_error_date != null ? output.last_synchronization_error_date : undefined,
    allowed_updates: output.allowed_updates != null ? de_AllowedUpdateList(output.allowed_updates) : undefined,
  };
};

const de_AllowedUpdateList = (output: any[]): string[] => {
  return (output || []).filter((e) => e != null);
};
