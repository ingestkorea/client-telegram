import { NodeHttpHandler } from '@ingestkorea/util-http-handler';
import { IngestkoreaError } from '@ingestkorea/util-error-handler';
import { TelegramCommand } from './models';

export type Credentials = {
  credentials?: {
    token?: string
    chatId?: string | number
  }
};

export type ResolvedCredentials = {
  credentials: {
    token: string
    chatId: string
  }
};

export type TelegramClientConfigType = Credentials;
export interface TelegramClientConfig extends TelegramClientConfigType {

};

export type TelegramClientResolvedConfigType = ResolvedCredentials;
export interface TelegramClientResolvedConfig extends TelegramClientResolvedConfigType {

};

export class TelegramClient {
  config: TelegramClientResolvedConfig;
  httpHandler: NodeHttpHandler
  constructor(config: TelegramClientConfig) {
    const resolvedConfig = resolveConfig(config);
    this.config = {
      ...resolvedConfig
    };
    this.httpHandler = new NodeHttpHandler({ connectionTimeout: 3000, socketTimeout: 3000 })
  };
  async send<T, P>(command: TelegramCommand<T, P, TelegramClientResolvedConfig>): Promise<P> {
    const { httpHandler, config } = this;

    let input = command.input;
    let request = await command.serialize(input, config);
    let { response } = await httpHandler.handle(request);
    let output = await command.deserialize(response);
    return output;
  };
};

const resolveConfig = (config: TelegramClientConfig): TelegramClientResolvedConfig => {
  const { credentials } = config;
  if (!credentials) throw new IngestkoreaError({
    code: 401, type: 'Unauthorized',
    message: 'Invalid Credentials', description: 'Invalid Client Credentials Config'
  });
  const { token, chatId } = credentials;
  if (!token || !chatId) throw new IngestkoreaError({
    code: 401, type: 'Unauthorized',
    message: 'Invalid Credentials', description: 'Invalid Token or ChatId'
  });
  const resolvedToken = resolveToken(token);
  const resolvedChatId = chatId.toString();
  return {
    credentials: {
      token: resolvedToken,
      chatId: resolvedChatId
    }
  };
};

const resolveToken = (token: string) => {
  const [botNumber, botId] = <Array<string | undefined>>token.split(':');
  if (!botNumber || !botId) throw new IngestkoreaError({
    code: 401, type: 'Unauthorized',
    message: 'Invalid Credentials', description: 'Invalid Token Structure'
  });
  return [botNumber.replace(/[a-zA-Z+-\/_]+/i, ""), botId].join(':');
};