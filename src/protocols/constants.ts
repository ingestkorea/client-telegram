import { HttpResponse, collectBodyString, destroyStream } from "@ingestkorea/util-http-handler";
import {
  ResponseMetadata,
  Fail,
  TelegramClientError,
  TelegramClientErrorCode,
  HTTP_ERROR_MAP,
} from "../models/index.js";
import { createValidator } from "../utils/validator.js";

const validateFail = createValidator<Fail>([
  { key: "ok", expectedType: "boolean" },
  { key: "error_code", expectedType: "number" },
  { key: "description", expectedType: "string" },
]);

const extractTelegramClientErrorCode = (
  statusCode: number,
  fallbackCode?: TelegramClientErrorCode,
): TelegramClientErrorCode => {
  if (statusCode in HTTP_ERROR_MAP) {
    return HTTP_ERROR_MAP[statusCode as keyof typeof HTTP_ERROR_MAP];
  }
  return fallbackCode || "SDK.UNKNOWN_ERROR";
};

export const deserializeMetadata = (response: HttpResponse): ResponseMetadata => {
  return {
    httpStatusCode: response.statusCode,
  };
};

export const parseBody = async (output: HttpResponse): Promise<any> => {
  const { statusCode, headers, body: streamBody } = output;

  if (!isJsonResponse(headers["content-type"])) {
    await destroyStream(streamBody);

    throw new TelegramClientError({
      statusCode: statusCode,
      code: extractTelegramClientErrorCode(statusCode, "SDK.REQUEST_ERROR"),
      message: "response content-type is not application/json",
    });
  }

  try {
    const data = await collectBodyString(streamBody);
    return data.length ? JSON.parse(data) : {};
  } catch (e) {
    await destroyStream(streamBody);

    throw new TelegramClientError({
      statusCode: statusCode,
      code: extractTelegramClientErrorCode(statusCode, "SDK.REQUEST_ERROR"),
      message: e instanceof Error ? e.message : "parse response body error",
    });
  }
};

export const parseErrorBody = async (output: HttpResponse): Promise<void> => {
  const { statusCode, headers, body: streamBody } = output;
  const DEFAULT_SDK_ERROR_CODE = extractTelegramClientErrorCode(statusCode);

  if (!isJsonResponse(headers["content-type"])) {
    await destroyStream(streamBody);

    throw new TelegramClientError({
      statusCode: statusCode,
      code: DEFAULT_SDK_ERROR_CODE,
      message: "response content-type is not application/json",
    });
  }

  try {
    const data = await collectBodyString(streamBody);
    const valid = validateFail(data);

    if (valid.success) {
      throw new TelegramClientError({
        statusCode: statusCode,
        code: extractTelegramClientErrorCode(valid.data.error_code),
        message: valid.data.description,
      });
    }

    throw new TelegramClientError({
      statusCode: statusCode,
      code: DEFAULT_SDK_ERROR_CODE,
      message: `[Invalid Response Payload] ${data.slice(0, 100)}...`,
    });
  } catch (error) {
    await destroyStream(streamBody);

    if (error instanceof TelegramClientError) {
      throw error;
    }
    throw new TelegramClientError({
      statusCode: statusCode,
      code: DEFAULT_SDK_ERROR_CODE,
      message: error instanceof Error ? error.message : "parse response body error",
    });
  }
};

export const compact = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map((item) => compact(item)) as any;
  }

  if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, value]) => value !== undefined) // undefined 필드 제거
        .map(([key, value]) => [key, compact(value)]), // 내부 값 재귀 처리
    ) as any;
  }

  return obj;
};

const isJsonResponse = (contentType?: string): boolean => {
  return /application\/json/gi.exec(contentType || "") ? true : false;
};
