import { HttpRequest, HttpResponse, NodeHttpHandler } from "@ingestkorea/util-http-handler";
import { TelegramClientResolvedConfig } from "../TelegramClient";
import { MetadataBearer } from "./MetadataBearer";

export interface BuildMiddleware {
  (request: HttpRequest, config: TelegramClientResolvedConfig): Promise<HttpRequest>;
}

export interface DeserializeMiddleware {
  (request: HttpRequest, config: TelegramClientResolvedConfig, handler: NodeHttpHandler): Promise<{
    response: HttpResponse;
    output: MetadataBearer;
  }>;
}
