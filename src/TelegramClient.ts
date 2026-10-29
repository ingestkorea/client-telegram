import { NodeHttpHandler } from "@ingestkorea/util-http-handler";
import {
  TelegramClientConfig,
  TelegramClientResolvedConfig,
  TelegramCommand,
  MetadataBearer,
  Middleware,
  Handler,
  TelegramClientError,
} from "./models/index.js";
import { middlewareIngestkoreaMetadata, middlewareRetry } from "./middleware/index.js";

export class TelegramClient {
  config: TelegramClientResolvedConfig;
  private httpHandler;

  constructor(config: TelegramClientConfig) {
    this.config = resolveClientConfig(config);
    this.httpHandler = new NodeHttpHandler(this.config.httpHandler);
  }

  async send<T extends object, P extends MetadataBearer>(
    command: TelegramCommand<T, P, TelegramClientResolvedConfig>,
  ): Promise<P> {
    const middlewares: Middleware[] = [middlewareIngestkoreaMetadata, middlewareRetry];
    const finalHandler: Handler<T, P> = async (input, context) => {
      const { response } = await this.httpHandler.handle(input.request);
      const output = await command.deserializer(response, context);
      return { response, output };
    };
    const handler = composeMiddleware(middlewares, finalHandler);

    try {
      const request = await command.serializer(command.input, this.config);
      const { output } = await handler({ request, input: command.input }, this.config);
      return output;
    } catch (error) {
      if (error instanceof TelegramClientError) {
        throw error;
      }
      throw new TelegramClientError({
        statusCode: -1,
        code: "SDK.UNKNOWN_ERROR",
        message: error instanceof Error ? error.message : "unknown error",
      });
    }
  }
}

const composeMiddleware = <I extends object, O extends MetadataBearer>(
  middlewares: Middleware[],
  finalHandler: Handler<I, O>,
): Handler<I, O> => {
  const handler = middlewares.reduceRight((next, middleware) => {
    return middleware(next);
  }, finalHandler);
  return handler;
};

const resolveClientConfig = (config: TelegramClientConfig): TelegramClientResolvedConfig => {
  return {
    credentials: resolveCredentials(config.credentials),
    httpHandler: {
      connectionTimeout: config?.connectionTimeout ?? 3000,
      socketTimeout: config?.socketTimeout ?? 5000,
      keepAlive: config?.keepAlive ?? true,
    },
  };
};

const resolveCredentials = (
  credentials: TelegramClientConfig["credentials"],
): TelegramClientResolvedConfig["credentials"] => {
  if (!credentials) {
    throw new TelegramClientError({
      statusCode: -1,
      code: "SDK.AUTH_ERROR",
      message: "Invalid Credentials",
    });
  }

  const { token, chatId } = credentials;

  if (!token || !chatId) {
    throw new TelegramClientError({
      statusCode: -1,
      code: "SDK.AUTH_ERROR",
      message: "Invalid Credentials: Token or ChatId undefined",
    });
  }

  return {
    token: resolveToken(token),
    chatId: chatId.toString(),
  };
};

const resolveToken = (token: string) => {
  const [botNumber, botId] = token.split(":");
  if (!botNumber || !botId) {
    throw new TelegramClientError({
      statusCode: -1,
      code: "SDK.AUTH_ERROR",
      message: "Invalid Token Structure",
    });
  }

  return [botNumber.replace(/[a-zA-Z+-\/_]+/i, ""), botId].join(":");
};
