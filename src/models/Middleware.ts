import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { TelegramClientResolvedConfig } from "../TelegramClient.js";

export type Middleware = (next: Handler) => Handler;

export type Handler = (
  input: { request: HttpRequest },
  context: TelegramClientResolvedConfig
) => Promise<{ response: HttpResponse }>;
