import { NodeHttpHandler } from "@ingestkorea/util-http-handler";
import { IngestkoreaError } from "@ingestkorea/util-error-handler";
import { TelegramCommand, Middleware, Handler } from "./models";
import {
  middlewareIngestkoreaMetadata,
  middlewareSortHeaders,
  middlewareRetry,
  middlewareSerialize,
  middlewareDeserialize,
} from "./middleware";

type CredentialsInputConfig = {
  credentials?: {
    token?: string;
    chatId?: string | number;
  };
};
type NodeHttpHandlerInputConfig = {
  connectionTimeout?: number;
  socketTimeout?: number;
};

type CredentialsResolvedConfig = {
  credentials: {
    token: string;
    chatId: string;
  };
};
type NodeHttpHandlerResolvedConfig = {
  connectionTimeout: number;
  socketTimeout: number;
};

export type TelegramClientConfigType = CredentialsInputConfig & NodeHttpHandlerInputConfig;
export interface TelegramClientConfig extends TelegramClientConfigType {}

export type TelegramClientResolvedConfigType = CredentialsResolvedConfig & NodeHttpHandlerResolvedConfig;
export interface TelegramClientResolvedConfig extends TelegramClientResolvedConfigType {}

export class TelegramClient {
  config: TelegramClientResolvedConfig;
  private httpHandler: NodeHttpHandler;
  private requestHandler: Handler<any, any>;
  constructor(config: TelegramClientConfig) {
    this.config = resolveClientConfig(config);
    this.httpHandler = new NodeHttpHandler({
      connectionTimeout: this.config.connectionTimeout,
      socketTimeout: this.config.socketTimeout,
    });
    this.requestHandler = async (request) => {
      return this.httpHandler.handle(request);
    };
  }
  async send<T, P>(command: TelegramCommand<T, P, TelegramClientResolvedConfig>): Promise<P> {
    const stack = [
      middlewareSerialize(command.serializer),
      middlewareIngestkoreaMetadata,
      middlewareSortHeaders,
      middlewareRetry,
      middlewareDeserialize(command.deserializer),
    ];
    const handler = composeMiddleware(stack, this.config, this.requestHandler);
    const response = await handler(command.input);
    return response.output;
  }
}

const composeMiddleware = (
  middlewares: Middleware<any, any>[],
  config: TelegramClientResolvedConfig,
  finalHandler: Handler<any, any>
) => {
  const handler = middlewares.reduceRight((next, middleware) => {
    return middleware(next, config);
  }, finalHandler);
  return handler;
};

const resolveClientConfig = (config: TelegramClientConfig): TelegramClientResolvedConfig => {
  const { credentials, connectionTimeout, socketTimeout } = config;

  const resolvedCredentials = resolveCredentials(credentials);
  return {
    ...resolvedCredentials,
    connectionTimeout: connectionTimeout ? connectionTimeout : 5000,
    socketTimeout: socketTimeout ? socketTimeout : 5000,
  };
};

const resolveCredentials = (credentials: any): CredentialsResolvedConfig => {
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
    credentials: {
      token: resolveToken(token),
      chatId: chatId.toString(),
    },
  };
};

const resolveToken = (token: string) => {
  const [botNumber, botId] = token.split(":") as Array<string | undefined>;
  if (!botNumber || !botId)
    throw new IngestkoreaError({
      code: 400,
      type: "Bad Request",
      message: "Invalid Params",
      description: "Invalid Token Structure",
    });
  return [botNumber.replace(/[a-zA-Z+-\/_]+/i, ""), botId].join(":");
};
