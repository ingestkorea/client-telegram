export interface DeleteWebhookRequest {
  drop_pending_updates?: boolean;
}

export interface DeleteWebhookResult {
  ok?: boolean;
  result?: boolean;
  description?: string;
}
