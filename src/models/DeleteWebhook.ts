import { TelegramSuccess } from "./TelegramResponse.js";

export type DeleteWebhookRequest = {
  drop_pending_updates?: boolean;
};

export type DeleteWebhookResult = TelegramSuccess<boolean>;
