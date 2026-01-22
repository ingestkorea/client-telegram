import { HttpResponse, collectBodyString } from "@ingestkorea/util-http-handler";
import { ResponseMetadata, TelegramResponse, TelegramSuccess, TelegramFailure } from "../models/index.js";
import { INGESTKOREA_RETRY, INGESTKOREA_RETRY_DELAY } from "../middleware/constants.js";

export const deserializeMetadata = (response: HttpResponse): ResponseMetadata => {
  const attempts = response.headers[INGESTKOREA_RETRY] || undefined;
  const totalRetryDelay = response.headers[INGESTKOREA_RETRY_DELAY] || undefined;

  return {
    httpStatusCode: response.statusCode,
    ...(attempts && { attempts: Number(attempts) }),
    ...(totalRetryDelay && { totalRetryDelay: Number(totalRetryDelay) }),
  };
};

export class TelegramApiError extends Error {
  readonly failure: TelegramFailure;

  constructor(failure: TelegramFailure) {
    super(failure.description || "Telegram API Error");
    this.name = "TelegramApiError";
    this.failure = failure;
  }
}

export const parseBody = async (response: HttpResponse): Promise<unknown> => {
  const { headers, body: streamBody } = response;

  const raw = await collectBodyString(streamBody);
  if (!raw) return {};

  const contentType = headers["content-type"] || "";

  if (contentType && !contentType.includes("application/json")) {
    const preview = raw.length > 100 ? raw.slice(0, 100) + "…" : raw;
    throw new TelegramApiError({
      ok: false,
      error_code: 500,
      description: `Expected application/json but got "${contentType}". Body preview: ${preview}`,
    });
  }

  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new TelegramApiError({
      ok: false,
      error_code: 500,
      description: `Invalid JSON response. ${e instanceof Error ? `${e.name}: ${e.message}` : String(e)}`,
    });
  }
};

const isTelegramShape = (x: unknown): x is { ok: boolean } => {
  return typeof x === "object" && x !== null && "ok" in x && typeof (x as any).ok === "boolean";
};

export const isSuccess = <T>(data: unknown): TelegramSuccess<T> => {
  if (!isTelegramShape(data)) {
    throw new TelegramApiError({
      ok: false,
      error_code: 500,
      description: "Response is not a Telegram API (missing ok:boolean).",
    });
  }

  const content = data as TelegramResponse<T>;

  if (!content.ok) {
    throw new TelegramApiError({
      ok: false,
      error_code: content.error_code || 400,
      description: content.description || "Telegram API returned ok=false",
    });
  }

  return content;
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
