import { HttpRequest } from "@ingestkorea/util-http-handler";
import { TelegramClientResolvedConfig } from "../TelegramClient";
import { SendMessageCommandInput, SendMessageCommandOutput } from "../commands/SendMessageCommand";
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
} from "../models";
import { parseBody, parseErrorBody, deserializeMetadata, _json } from "./constants";

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
  if (response.statusCode >= 300) await parseErrorBody(response);

  let data = await parseBody(response);
  let contents: any = {};
  contents = _json(de_SendMessageResult(data));

  return {
    $metadata: deserializeMetadata(response),
    ...contents,
  };
};

const de_SendMessageResult = (output: any): SendMessageResult => {
  return {
    ok: output.ok != null ? output.ok : undefined,
    result: output.result != null ? de_Message(output.result) : undefined,
  };
};

export const de_Message = (output: any): Message => {
  return {
    message_id: output.message_id != null ? output.message_id : undefined,
    from: output.from != null ? de_From(output.from) : undefined,
    chat: output.chat != null ? de_Chat(output.chat) : undefined,
    date: output.date != null ? output.date : undefined,
    text: output.text != null ? output.text : undefined,
    entities: output.entities != null ? de_EntityList(output.entities) : undefined,
    reply_markup: output.reply_markup != null ? de_InlineKeyboard(output.reply_markup) : undefined,
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
    type: output.type != null ? output.type : undefined,
    offset: output.offset != null ? output.offset : undefined,
    length: output.length != null ? output.length : undefined,
  };
};

const de_InlineKeyboard = (output: any): InlineKeyboard => {
  const { inline_keyboard } = output;
  return {
    inline_keyboard: inline_keyboard != undefined ? de_InlineKeyboardButtonList(inline_keyboard) : undefined,
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
        text: entry.text != undefined ? entry.text : undefined,
        url: entry.url != undefined ? entry.url : undefined,
      };
    });
  return result;
};
