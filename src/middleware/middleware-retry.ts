import { IngestkoreaError } from "@ingestkorea/util-error-handler";
import { Middleware } from "../models";

const REQUEST_HEADER = "x-ingestkorea-request";

export const middlewareRetry: Middleware<any, any> = (next, context) => async (request) => {
  const MAX_RETRIES = 3;
  let attempts = 0;
  let totalRetryDelay = 0;
  let lastError = new IngestkoreaError({
    code: 400,
    type: "Bad Request",
    message: "Invalid Request",
    description: { attempts, maxRetries: MAX_RETRIES, totalRetryDelay },
  });
  while (attempts < MAX_RETRIES) {
    try {
      const requestLog = `attempt=${attempts + 1}; max=${MAX_RETRIES}; totalRetryDelay=${totalRetryDelay}`;
      request.headers[REQUEST_HEADER] = requestLog;

      const { response, output } = await next(request);
      output.$metadata.attempts = attempts + 1;
      output.$metadata.totalRetryDelay = totalRetryDelay;
      return { response, output };
    } catch (error) {
      attempts++;
      if (attempts == MAX_RETRIES) {
        lastError.error.description.attempts = attempts;
        throw lastError;
      }

      const delay = attempts * 1000;
      totalRetryDelay += delay;
      lastError.error.description = { attempts, maxRetries: MAX_RETRIES, totalRetryDelay };

      if (error instanceof IngestkoreaError) {
        lastError.error.description = {
          ...lastError.error.description,
          detail: error.error.description,
        };
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};
