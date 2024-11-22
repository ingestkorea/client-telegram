import { HttpRequest } from "@ingestkorea/util-http-handler";
import { TelegramClientResolvedConfig } from "../TelegramClient";
import { BuildMiddleware } from "../models";

export const middlewareIngestkoreaMetadata: BuildMiddleware = async (
  request: HttpRequest,
  config: TelegramClientResolvedConfig
) => {
  const { longDate } = convertFormatDate();
  request.headers = {
    ...request.headers,
    ["x-ingestkorea-date"]: longDate,
    ["x-ingestkorea-user-agent"]: "@ingestkorea/client-telegram/1.2.x",
  };
  return request;
};

/**
 * @param input milliseconds
 */
const convertFormatDate = (input?: string | number) => {
  let milliseconds = input ? Number(input) : new Date().getTime();
  let iso8601 = new Date(milliseconds).toISOString().replace(/\.\d{3}Z$/, "Z");

  let longDate = iso8601.replace(/[\-:]/g, "");
  let shortDate = longDate.slice(0, 8);
  return { longDate, shortDate };
};
