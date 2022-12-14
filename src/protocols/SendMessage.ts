import { HttpRequest, HttpResponse } from '@ingestkorea/util-http-handler';
import { TelegramClientResolvedConfig } from '../TelegramClient';
import { SendMessageCommandInput, SendMessageCommandOutput } from '../commands/SendMessageCommand';
import { SendMessageOutput, Result, From, Chat, Entities } from '../models/SendMessage';
import { parseBody, parseErrorBody } from './constants';

export const serializeIngestkorea_restJson_SendMessageCommand = async (
  input: SendMessageCommandInput,
  config: TelegramClientResolvedConfig
): Promise<HttpRequest> => {
  const { text, chatId, parse_mode, disable_web_page_preview } = input;
  const { token, chatId: defaultChatId } = config.credentials;
  const hostname = "api.telegram.org";
  const path = "/bot" + token + "/sendMessage";
  const headers = { "content-type": "application/json; charset=utf-8" };
  const body = JSON.stringify({
    chat_id: chatId != undefined ? chatId.toString() : defaultChatId,
    text: text,
    ...(parse_mode !== undefined && { parse_mode: parse_mode }),
    ...(disable_web_page_preview !== undefined && { disable_web_page_preview: disable_web_page_preview })
  });
  return new HttpRequest({
    protocol: 'https:',
    method: 'POST',
    hostname: hostname,
    path: path,
    headers: headers,
    body: body
  });
};

export const deserializeIngestkorea_restJson_SendMessageCommand = async (
  output: HttpResponse
): Promise<SendMessageCommandOutput> => {
  if (output.statusCode >= 300) await parseErrorBody(output);
  let data = await parseBody(output); //SendMessageOutput
  let contents: any = {};
  contents = deserializeIngestkorea_restJson_SendMessageOutput(data);

  const response: SendMessageCommandOutput = {
    ...contents
  };
  return response;
};

export const deserializeIngestkorea_restJson_SendMessageOutput = (output: any): SendMessageOutput => {
  const { ok, result } = output;
  return {
    ok: ok != null ? ok : undefined,
    result: result != null ? deserializeIngestkorea_restJson_MessageResult(result) : undefined
  } as any
};

export const deserializeIngestkorea_restJson_MessageResult = (output: any): Result => {
  const { message_id, from, chat, date, text, entities } = output;
  return {
    message_id: message_id != null ? message_id : undefined,
    from: from != null ? deserializeIngestkorea_restJson_MessageFrom(from) : undefined,
    chat: chat != null ? deserializeIngestkorea_restJson_MessageChat(chat) : undefined,
    date: date != null ? date : undefined,
    text: text != null ? text : undefined,
    entities: entities != null ? deserializeIngestkorea_restJson_MessageEntities(entities) : undefined
  };
};

export const deserializeIngestkorea_restJson_MessageFrom = (output: any): From => {
  const { id, is_bot, first_name, username } = output;
  return {
    id: id != null ? id : undefined,
    is_bot: is_bot != null ? is_bot : undefined,
    first_name: first_name != null ? first_name : undefined,
    username: username != null ? username : undefined,
  };
};

export const deserializeIngestkorea_restJson_MessageChat = (output: any): Chat => {
  const { id, first_name, last_name, username, type } = output;
  return {
    id: id != null ? id : undefined,
    first_name: first_name != null ? first_name : undefined,
    last_name: last_name != null ? last_name : undefined,
    username: username != null ? username : undefined,
    type: type != null ? type : undefined
  };
};

export const deserializeIngestkorea_restJson_MessageEntities = (output: any[]): Entities[] => {
  const result: Entities[] = output.map(data => {
    const { type, offset, length } = data;
    return {
      type: type != null ? type : undefined,
      offset: offset != null ? offset : undefined,
      length: length != null ? length : undefined,
    };
  });
  return result;
};
