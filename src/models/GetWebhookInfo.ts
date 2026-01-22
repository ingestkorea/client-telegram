import { TelegramSuccess } from "./TelegramResponse.js";

export type GetWebhookInfoRequest = {};

export type GetWebhookInfoResult = TelegramSuccess<WebhookInfo>;

export type WebhookInfo = {
  url?: string;
  has_custom_certificate?: boolean;
  pending_update_count?: number;
  max_connections?: number;
  ip_address?: string;
  last_error_date?: number;
  last_error_message?: string;
  last_synchronization_error_date?: number;
  allowed_updates?: string[];
};
