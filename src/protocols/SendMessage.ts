import { HttpRequest } from "@ingestkorea/util-http-handler";
import {
  TelegramClientResolvedConfig,
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
import { SendMessageCommandInput, SendMessageCommandOutput } from "../commands/SendMessageCommand.js";
import { deserializeMetadata, parseBody, parseErrorBody, compact } from "./constants.js";

export const se_SendMessageCommand: RequestSerializer<SendMessageCommandInput, TelegramClientResolvedConfig> = async (
  input,
  config,
) => {
  const { token, chatId } = config.credentials;
  const hostname = "api.telegram.org";
  const path = "/bot" + token + "/sendMessage";
  const headers = { "content-type": "application/json; charset=utf-8" };
  const body = JSON.stringify({
    ...input,
    chat_id: input.chat_id ? input.chat_id.toString() : chatId,
  });

  return new HttpRequest({
    protocol: "https:",
    method: "POST",
    hostname,
    path,
    headers,
    body,
  });
};

export const de_SendMessageCommand: ResponseDeserializer<
  SendMessageCommandOutput,
  TelegramClientResolvedConfig
> = async (response, config) => {
  if (response.statusCode >= 300) await parseErrorBody(response);

  const data = await parseBody(response);
  const contents = de_SendMessageResult(data);

  return {
    $metadata: deserializeMetadata(response),
    ...compact(contents),
  };
};

const de_SendMessageResult = (output: any): SendMessageResult => {
  return {
    ok: true,
    result: de_Message(output.result),
  };
};

export const de_Message = (output: any): Message => {
  return {
    message_id: output.message_id,
    date: output.date,
    from: de_From(output.from),
    chat: de_Chat(output.chat),
    text: output.text ? output.text : undefined,
    entities: output.entities ? de_EntityList(output.entities) : undefined,
    reply_markup: output.reply_markup ? de_InlineKeyboard(output.reply_markup) : undefined,
  };
};

const de_From = (output: any): From => {
  return {
    id: output.id,
    is_bot: output.is_bot,
    first_name: output.first_name,
    last_name: output.last_name ? output.last_name : undefined,
    language_code: output.language_code ? output.language_code : undefined,
    username: output.username ? output.username : undefined,
  };
};

const de_Chat = (output: any): Chat => {
  return {
    id: output.id,
    type: output.type,
    first_name: output.first_name ? output.first_name : undefined,
    last_name: output.last_name ? output.last_name : undefined,
    username: output.username ? output.username : undefined,
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
