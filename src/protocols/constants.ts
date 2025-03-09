import { IngestkoreaError, ingestkoreaErrorCodeChecker } from "@ingestkorea/util-error-handler";
import { HttpResponse, collectBodyString } from "@ingestkorea/util-http-handler";
import { ResponseMetadata, TelegramErrorInfo } from "../models";

export const deserializeMetadata = (response: HttpResponse): ResponseMetadata => {
  return {
    httpStatusCode: response.statusCode,
  };
};

export const parseBody = async (response: HttpResponse): Promise<any> => {
  const { statusCode, headers, body: streamBody } = response;
  const data = await collectBodyString(streamBody);
  if (!data) return {};

  try {
    return JSON.parse(data);
  } catch (e) {
    throw new IngestkoreaError({
      code: 400,
      type: "Bad Request",
      message: "Invalid Request",
      description: "SyntaxError: content-type is not application/json",
    });
  }
};

export const parseErrorBody = async (response: HttpResponse): Promise<void> => {
  const data = await parseBody(response);

  let contents: any = {};
  contents = _json(de_TelegramErrorInfo(data));

  throw new IngestkoreaError({
    code: ingestkoreaErrorCodeChecker(response.statusCode) ? response.statusCode : 400,
    type: "Bad Request",
    message: "Invalid Request",
    description: contents,
  });
};

export const _json = (obj: any): any => {
  if (obj == null) return {};
  if (Array.isArray(obj)) return obj.filter((d) => d != null).map(_json);
  if (typeof obj === "object") {
    const target: any = {};
    for (const key of Object.keys(obj)) {
      if (obj[key] == null) continue;
      target[key] = _json(obj[key]);
    }
    return target;
  }
  return obj;
};

const de_TelegramErrorInfo = (output: any): TelegramErrorInfo => {
  return {
    ok: output.ok != null ? output.ok : undefined,
    error_code: output.error_code != null ? output.error_code : undefined,
    description: output.description != null ? output.description : undefined,
  };
};
