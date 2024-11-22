import { HttpRequest } from "@ingestkorea/util-http-handler";
import { TelegramClientResolvedConfig } from "../TelegramClient";
import { BuildMiddleware } from "../models";

export const middlewareSortHeaders: BuildMiddleware = async (
  request: HttpRequest,
  config: TelegramClientResolvedConfig
) => {
  let { headers } = request;
  let init: Record<string, string> = {};
  const sortedHeaders = Object.keys(headers)
    .sort()
    .reduce((acc, curr) => {
      acc[curr] = headers[curr];
      return acc;
    }, init);
  request.headers = sortedHeaders;
  return request;
};
