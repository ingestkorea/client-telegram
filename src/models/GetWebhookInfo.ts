export interface GetWebhookInfoRequest {}

export interface GetWebhookInfoResult {
  ok?: boolean;
  result?: WebhookInfo;
}

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
