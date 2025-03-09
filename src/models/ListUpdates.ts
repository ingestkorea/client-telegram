import { Message } from "./SendMessage";

export interface ListUpdatesRequest {
  offset?: number;
  limit?: number;
  timeout?: number;
}

export interface ListUpdatesResult {
  ok?: boolean;
  result?: UpdateInfo[];
}

export type UpdateInfo = {
  update_id?: number;
  message?: Message;
};
