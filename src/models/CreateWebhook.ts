import { Success } from "./TelegramApi.js";

export type CreateWebhookRequest = {
  url: string;
  max_connections?: number;
  allowed_updates?: string[];
  drop_pending_updates?: boolean;
  secret_token?: string;
};

export type CreateWebhookResult = Success<boolean> & {
  description?: string;
};
