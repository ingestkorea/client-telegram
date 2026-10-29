import { HttpHandlerErrorCode } from "@ingestkorea/util-http-handler";

export const HTTP_ERROR_MAP = {
  400: "SDK.BAD_REQUEST",
  401: "SDK.UNAUTHORIZED",
  403: "SDK.FORBIDDEN",
  404: "SDK.NOT_FOUND",
  429: "SDK.TOO_MANY_REQUESTS",
  500: "SDK.SERVER_ERROR",
} as const;

type TelegramClientHttpErrorCode = (typeof HTTP_ERROR_MAP)[keyof typeof HTTP_ERROR_MAP];
type TelegramClientSdkErrorCode = "SDK.AUTH_ERROR" | "SDK.GENERAL_ERROR" | "SDK.REQUEST_ERROR" | "SDK.UNKNOWN_ERROR";

export type TelegramClientErrorCode = HttpHandlerErrorCode | TelegramClientHttpErrorCode | TelegramClientSdkErrorCode;

export class TelegramClientError extends Error {
  public readonly statusCode: number;
  public readonly code: TelegramClientErrorCode;
  public readonly timestamp: string;
  constructor(input: { statusCode: number; code: TelegramClientErrorCode; message: string }) {
    super(input.message);
    this.name = "TelegramClientError";
    this.statusCode = input.statusCode; // http status code
    this.code = input.code; // SDK custom error coe
    this.timestamp = new Date().toISOString();
  }
}
