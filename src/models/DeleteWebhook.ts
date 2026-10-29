import { Success } from "./TelegramApi.js";

export type DeleteWebhookRequest = {
  drop_pending_updates?: boolean;
};

export type DeleteWebhookResult = Success<boolean> & {
  description?: string;
};
