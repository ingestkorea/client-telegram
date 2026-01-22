import { NodeHttpHandler } from "@ingestkorea/util-http-handler";
import { IngestkoreaError } from "@ingestkorea/util-error-handler";
import { TelegramCommand, Middleware, Handler } from "./models/index.js";
import { middlewareIngestkoreaMetadata, middlewareRetry } from "./middleware/index.js";

type Credentials = {
  token?: string;
  chatId?: string | number;
};
type NodeHttpHandlerConfig = {
  connectionTimeout?: number;
  socketTimeout?: number;
};

type ResolvedCredentials = {
  token: string;
  chatId: string;
};
type ResolvedNodeHttpHandlerConfig = {
  connectionTimeout: number;
  socketTimeout: number;
};

export interface TelegramClientConfig extends NodeHttpHandlerConfig {
  credentials?: Credentials;
}
export interface TelegramClientResolvedConfig extends ResolvedNodeHttpHandlerConfig {
  credentials: ResolvedCredentials;
}

export class TelegramClient {
  config: TelegramClientResolvedConfig;
  private httpHandler: NodeHttpHandler;
  private handler: Handler;

  constructor(config: TelegramClientConfig) {
    this.config = resolveClientConfig(config);
    this.httpHandler = new NodeHttpHandler({
      connectionTimeout: this.config.connectionTimeout,
      socketTimeout: this.config.socketTimeout,
    });

    const middlewares: Middleware[] = [middlewareIngestkoreaMetadata, middlewareRetry];
    const requestHandler: Handler = async (input, context) => this.httpHandler.handle(input.request);

    this.handler = composeMiddleware(middlewares, requestHandler);
  }

  async send<I, O>(command: TelegramCommand<I, O, TelegramClientResolvedConfig>): Promise<O> {
    const { input, serializer, deserializer } = command;
    this.httpHandler.destroy();
    try {
      const request = await serializer(input, this.config);
      const { response } = await this.handler({ request }, this.config);
      const output = await deserializer(response, this.config);
      return output;
    } catch (e) {
      throw e;
    }
  }
}

const composeMiddleware = (middlewares: Middleware[], finalHandler: Handler): Handler => {
  const handler = middlewares.reduceRight((next, middleware) => {
    return middleware(next);
  }, finalHandler);
  return handler;
};

const resolveClientConfig = (config: TelegramClientConfig): TelegramClientResolvedConfig => {
  const { credentials, connectionTimeout, socketTimeout } = config;

  return {
    credentials: resolveCredentials(credentials),
    connectionTimeout: connectionTimeout || 3000,
    socketTimeout: socketTimeout || 3000,
  };
};

const resolveCredentials = (credentials?: Credentials): ResolvedCredentials => {
  let lastError = new IngestkoreaError({
    code: 400,
    type: "Bad Request",
    message: "Invalid Params",
    description: "Invalid Client Credentials Config",
  });
  if (!credentials) throw lastError;

  const { token, chatId } = credentials;
  if (!token || !chatId) {
    lastError.error.description = "Token or ChatId undefined";
    throw lastError;
  }

  return {
    token: resolveToken(token),
    chatId: chatId.toString(),
  };
};

const resolveToken = (token: string) => {
  const [botNumber, botId] = token.split(":");
  if (!botNumber || !botId)
    throw new IngestkoreaError({
      code: 400,
      type: "Bad Request",
      message: "Invalid Params",
      description: "Invalid Token Structure",
    });
  return [botNumber.replace(/[a-zA-Z+-\/_]+/i, ""), botId].join(":");
};
