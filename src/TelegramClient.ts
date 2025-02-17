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

export type Credentials = {
  credentials?: {
    token?: string;
    chatId?: string | number;
  };
};

export type ResolvedCredentials = {
  credentials: {
    token: string;
    chatId: string;
  };
};

export type TelegramClientConfigType = Credentials;
export interface TelegramClientConfig extends TelegramClientConfigType {}

export type TelegramClientResolvedConfigType = ResolvedCredentials;
export interface TelegramClientResolvedConfig extends TelegramClientResolvedConfigType {}

export class TelegramClient {
  config: TelegramClientResolvedConfig;
  private requestHandler: Handler<any, any>;
  constructor(config: TelegramClientConfig) {
    this.config = resolveConfig(config);
    this.requestHandler = async (request) => {
      const httpHandler = new NodeHttpHandler({ connectionTimeout: 3000, socketTimeout: 3000 });
      return httpHandler.handle(request);
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

const resolveConfig = (config: TelegramClientConfig): TelegramClientResolvedConfig => {
  const { credentials } = config;
  if (!credentials)
    throw new IngestkoreaError({
      code: 400,
      type: "Bad Request",
      message: "Invalid Params",
      description: "Invalid Client Credentials Config",
    });
  const { token, chatId } = credentials;
  if (!token || !chatId)
    throw new IngestkoreaError({
      code: 400,
      type: "Bad Request",
      message: "Invalid Params",
      description: "Invalid Token or ChatId",
    });
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
