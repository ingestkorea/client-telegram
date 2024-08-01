import { HttpRequest, HttpResponse } from "@ingestkorea/util-http-handler";
import { TelegramClientResolvedConfig } from "../TelegramClient";
import { SendMessageCommandInput, SendMessageCommandOutput } from "../commands/SendMessageCommand";
import {
  SendMessageOutput,
  Message,
  From,
  Chat,
  Entities,
  InlineKeyboard,
  InlineKeyboardButton,
} from "../models/SendMessage";
import { parseBody, parseErrorBody } from "./constants";

export const serializeIngestkorea_restJson_SendMessageCommand = async (
  input: SendMessageCommandInput,
  config: TelegramClientResolvedConfig
): Promise<HttpRequest> => {
  const { token, chatId } = config.credentials;
  const hostname = "api.telegram.org";
  const path = "/bot" + token + "/sendMessage";
  const headers = { "content-type": "application/json; charset=utf-8" };
  const body = JSON.stringify({
    chat_id: input.chatId != undefined ? input.chatId.toString() : chatId,
    text: input.text,
    ...(input.parse_mode !== undefined && { parse_mode: input.parse_mode }),
    ...(input.disable_web_page_preview !== undefined && { disable_web_page_preview: input.disable_web_page_preview }),
    ...(input.disable_notification != undefined && { disable_notification: input.disable_notification }),
    ...(input.protect_content != undefined && { protect_content: input.protect_content }),
    ...(input.reply_markup != undefined && { reply_markup: input.reply_markup }),
  });
  return new HttpRequest({
    protocol: "https:",
    method: "POST",
    hostname: hostname,
    path: path,
    headers: headers,
    body: body,
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
    ...contents,
  };
  return response;
};

export const deserializeIngestkorea_restJson_SendMessageOutput = (output: any): SendMessageOutput => {
  const { ok, result } = output;
  return {
    ok: ok != null ? ok : undefined,
    result: result != null ? deserializeIngestkorea_restJson_MessageResult(result) : undefined,
  } as any;
};

export const deserializeIngestkorea_restJson_MessageResult = (output: any): Message => {
  const { message_id, from, chat, date, text, entities, reply_markup } = output;
  return {
    message_id: message_id != null ? message_id : undefined,
    from: from != null ? deserializeIngestkorea_restJson_From(from) : undefined,
    chat: chat != null ? deserializeIngestkorea_restJson_Chat(chat) : undefined,
    date: date != null ? date : undefined,
    text: text != null ? text : undefined,
    entities: entities != null ? deserializeIngestkorea_restJson_Entities(entities) : undefined,
    reply_markup: reply_markup != null ? deserializeIngestkorea_restJson_InlineKeyboard(reply_markup) : undefined,
  };
};

export const deserializeIngestkorea_restJson_From = (output: any): From => {
  const { id, is_bot, first_name, username } = output;
  return {
    id: id != null ? id : undefined,
    is_bot: is_bot != null ? is_bot : undefined,
    first_name: first_name != null ? first_name : undefined,
    username: username != null ? username : undefined,
  };
};

export const deserializeIngestkorea_restJson_Chat = (output: any): Chat => {
  const { id, first_name, last_name, username, type } = output;
  return {
    id: id != null ? id : undefined,
    first_name: first_name != null ? first_name : undefined,
    last_name: last_name != null ? last_name : undefined,
    username: username != null ? username : undefined,
    type: type != null ? type : undefined,
  };
};

export const deserializeIngestkorea_restJson_Entities = (output: any[]): Entities[] => {
  const result: Entities[] = output.map((data) => {
    const { type, offset, length } = data;
    return {
      type: type != null ? type : undefined,
      offset: offset != null ? offset : undefined,
      length: length != null ? length : undefined,
    };
  });
  return result;
};

export const deserializeIngestkorea_restJson_InlineKeyboard = (output: any): InlineKeyboard => {
  const { inline_keyboard } = output;

  return {
    inline_keyboard:
      inline_keyboard != undefined ? deserializeIngestkorea_restJson_InlineKeyboardButtons(inline_keyboard) : undefined,
  };
};

export const deserializeIngestkorea_restJson_InlineKeyboardButtons = (output: any[][]): InlineKeyboardButton[][] => {
  const result: InlineKeyboardButton[][] = output.map(deserializeIngestkorea_restJson_InlineKeyboardButton);
  return result;
};

export const deserializeIngestkorea_restJson_InlineKeyboardButton = (output: any[]): InlineKeyboardButton[] => {
  const result: InlineKeyboardButton[] = output.map((button) => {
    const { text, url } = button;
    return {
      text: text != undefined ? text : undefined,
      url: url != undefined ? url : undefined,
    };
  });
  return result;
};
