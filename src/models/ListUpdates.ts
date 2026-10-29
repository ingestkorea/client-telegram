import { Success } from "./TelegramApi.js";
import { Message } from "./SendMessage.js";

export type ListUpdatesRequest = {
  offset?: number;
  /**
   * Maximum number of updates to be retrieved (1-100).
   * @default 20
   */
  limit?: number;
  /**
   * Timeout in seconds for long polling (0-30).
   * @default 0
   */
  timeout?: number;
};

export type ListUpdatesResult = Success<UpdateInfo[]>;

export type UpdateInfo = {
  update_id: number;
  message?: Message;
};
