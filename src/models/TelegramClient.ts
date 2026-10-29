import { NodeHttpHandlerOptions } from "@ingestkorea/util-http-handler";

type Credentials = {
  token: string;
  chatId: string | number;
};

type HttpHandlerOptions = Pick<NodeHttpHandlerOptions, "connectionTimeout" | "socketTimeout" | "keepAlive"> & {
  /**
   * Connection timeout in milliseconds.
   * @default 3000
   */
  connectionTimeout?: number;
  /**
   * Socket timeout in milliseconds.
   * @default 5000
   */
  socketTimeout?: number;
  /**
   * @default true
   */
  keepAlive?: boolean;
};

export interface TelegramClientConfig extends HttpHandlerOptions {
  credentials?: Partial<Credentials>;
}

export interface TelegramClientResolvedConfig {
  httpHandler: Required<HttpHandlerOptions>;
  credentials: Credentials & { chatId: string };
}
