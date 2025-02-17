export interface SendMessageRequest {
  text: string;
  chatId?: string | number;
  parse_mode?: ParseMode;
  disable_web_page_preview?: boolean;
  disable_notification?: boolean;
  protect_content?: boolean;
  reply_markup?: ResolvedInlineKeyboard;
}

export type ParseMode = "MarkdownV2" | "HTML" | "Markdown";

export interface ResolvedInlineKeyboard {
  inline_keyboard: ResolvedInlineKeyboardButton[][];
}
export interface ResolvedInlineKeyboardButton extends Required<InlineKeyboardButton> {}

export interface SendMessageResult {
  ok?: boolean;
  result?: Message;
}

export interface Message {
  message_id?: number;
  from?: From;
  chat?: Chat;
  date?: number;
  text?: string;
  entities?: Entities[];
  reply_markup?: InlineKeyboard;
}

export interface From {
  id?: number;
  is_bot?: boolean;
  first_name?: string;
  username?: string;
}

export interface Chat {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  type?: string;
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
