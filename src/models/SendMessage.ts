import { Success } from "./TelegramApi.js";

export type SendMessageRequest = {
  text: string;
  /**
   * @deprecated
   * `chatId` is deprecated. Please use `chat_id` instead.
   * It will be completely removed in v1.7.0.
   */
  chatId?: string | number;
  chat_id?: string | number;
  parse_mode?: ParseMode;
  disable_web_page_preview?: boolean;
  disable_notification?: boolean;
  protect_content?: boolean;
  reply_markup?: InlineKeyboardMarkup;
};

export type SendMessageResult = Success<Message>;

export type ParseMode = "MarkdownV2" | "HTML" | "Markdown";

export interface InlineKeyboardMarkup {
  inline_keyboard: ResolvedInlineKeyboardButton[][];
}
export interface ResolvedInlineKeyboardButton extends Required<InlineKeyboardButton> {}

export interface Message {
  message_id: number;
  date: number;
  from: From;
  chat: Chat;
  text?: string;
  entities?: Entities[];
  reply_markup?: InlineKeyboard;
}

export interface From {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  language_code?: string;
  username?: string;
}

export interface Chat {
  id: number;
  type: string;
  first_name?: string;
  last_name?: string;
  username?: string;
}

export interface Entities {
  type?: string;
  offset?: number;
  length?: number;
}

export interface InlineKeyboard {
  inline_keyboard?: InlineKeyboardButton[][];
}

export interface InlineKeyboardButton {
  text?: string;
  url?: string;
}
