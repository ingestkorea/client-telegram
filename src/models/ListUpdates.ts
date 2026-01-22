import { TelegramSuccess } from "./TelegramResponse.js";
import { Message } from "./SendMessage.js";

export type ListUpdatesRequest = {
  offset?: number;
  limit?: number;
  timeout?: number;
};

export type ListUpdatesResult = TelegramSuccess<UpdateInfo[]>;

export type UpdateInfo = {
  update_id?: number;
  message?: Message;
};
