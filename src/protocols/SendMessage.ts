import { HttpRequest } from "@ingestkorea/util-http-handler";
import { TelegramClientResolvedConfig } from "../TelegramClient.js";
import { parseBody, isSuccess, deserializeMetadata, _json } from "./constants.js";
import {
  RequestSerializer,
  ResponseDeserializer,
  SendMessageResult,
  Message,
  From,
  Chat,
  Entities,
  InlineKeyboard,
  InlineKeyboardButton,
} from "../models/index.js";
import { SendMessageCommandInput, SendMessageCommandOutput } from "../commands/index.js";

export const se_SendMessageCommand: RequestSerializer<SendMessageCommandInput, TelegramClientResolvedConfig> = async (
  input,
  config
) => {
  const { token, chatId } = config.credentials;
  const hostname = "api.telegram.org";
  const path = "/bot" + token + "/sendMessage";
  const headers = { "content-type": "application/json; charset=utf-8" };
  const body = JSON.stringify({
    text: input.text,
    chat_id: input.chatId != undefined ? input.chatId.toString() : chatId,
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

export const de_SendMessageCommand: ResponseDeserializer<
  SendMessageCommandOutput,
  TelegramClientResolvedConfig
> = async (response, config) => {
  const $metadata = deserializeMetadata(response);

  const raw = await parseBody(response);
  const data = isSuccess<any>(raw);

  const content: SendMessageResult = {
    ok: true,
    result: de_Message(data.result),
    description: data.description,
  };

  return {
    $metadata,
    ..._json(content),
  };
};

export const de_Message = (output: any): Message => {
  return {
    message_id: output.message_id,
    from: output.from ? de_From(output.from) : undefined,
    chat: output.chat ? de_Chat(output.chat) : undefined,
    date: output.date,
    text: output.text,
    entities: output.entities ? de_EntityList(output.entities) : undefined,
    reply_markup: output.reply_markup ? de_InlineKeyboard(output.reply_markup) : undefined,
  };
};

const de_From = (output: any): From => {
  return {
    id: output.id != null ? output.id : undefined,
    is_bot: output.is_bot != null ? output.is_bot : undefined,
    first_name: output.first_name != null ? output.first_name : undefined,
    last_name: output.last_name != null ? output.last_name : undefined,
    language_code: output.language_code != null ? output.language_code : undefined,
    username: output.username != null ? output.username : undefined,
  };
};

const de_Chat = (output: any): Chat => {
  return {
    id: output.id != null ? output.id : undefined,
    first_name: output.first_name != null ? output.first_name : undefined,
    last_name: output.last_name != null ? output.last_name : undefined,
    username: output.username != null ? output.username : undefined,
    type: output.type != null ? output.type : undefined,
  };
};

const de_EntityList = (output: any[]): Entities[] => {
  const result = (output || []).filter((e) => e != null).map((entry) => de_Entity(entry));
  return result;
};

const de_Entity = (output: any): Entities => {
  return {
    type: output.type,
    offset: output.offset,
    length: output.length,
  };
};

const de_InlineKeyboard = (output: any): InlineKeyboard => {
  return {
    inline_keyboard: de_InlineKeyboardButtonList(output.inline_keyboard),
  };
};

const de_InlineKeyboardButtonList = (output: any[][]): InlineKeyboardButton[][] => {
  const result: InlineKeyboardButton[][] = (output || [[]])
    .filter((e) => e != null)
    .map((entry) => de_InlineKeyboardButton(entry));
  return result;
};

const de_InlineKeyboardButton = (output: any[]): InlineKeyboardButton[] => {
  const result: InlineKeyboardButton[] = (output || [])
    .filter((e) => e != null)
    .map((entry) => {
      return {
        text: entry.text,
        url: entry.url,
      };
    });
  return result;
};
