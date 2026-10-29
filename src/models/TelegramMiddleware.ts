import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { TelegramClientResolvedConfig } from "./TelegramClient.js";
import { MetadataBearer } from "./MetadataBearer.js";

export type Handler<Input extends object, Output extends MetadataBearer> = (
  args: { request: HttpRequest; input: Input },
  context: TelegramClientResolvedConfig,
) => Promise<{ response: HttpResponse; output: Output }>;

export type Middleware = <Input extends object, Output extends MetadataBearer>(
  next: Handler<Input, Output>,
) => Handler<Input, Output>;
