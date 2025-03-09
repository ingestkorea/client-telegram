import { Middleware } from "../models";

const USER_AGENT_HEADER = "x-ingestkorea-user-agent";
const DATE_HEADER = "x-ingestkorea-date";

export const middlewareIngestkoreaMetadata: Middleware<any, any> = (next, context) => async (request) => {
  const { longDate } = convertFormatDate();
  request.headers = {
    ...request.headers,
    [DATE_HEADER]: longDate,
    [USER_AGENT_HEADER]: "@ingestkorea/client-telegram/1.4.x",
  };
  return next(request);
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
