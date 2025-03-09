export interface CreateWebhookRequest {
  url: string;
  max_connections?: number;
  allowed_updates?: string[];
  drop_pending_updates?: boolean;
  secret_token?: string;
}

export interface CreateWebhookResult {
  ok?: boolean;
  result?: boolean;
  description?: string;
}
