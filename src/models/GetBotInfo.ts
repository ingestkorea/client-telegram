import { Success } from "./TelegramApi.js";

export type GetBotInfoRequest = {};

export type GetBotInfoResult = Success<BotInfo>;

export interface BotInfo {
  id?: number;
  is_bot?: boolean;
  first_name?: string;
  username?: string;
  can_join_groups?: boolean;
  can_read_all_group_messages?: boolean;
  can_connect_to_business?: boolean;
  can_manage_bots?: boolean;
  has_main_web_app?: boolean;
  has_topics_enabled?: boolean;
  allows_users_to_create_topics?: boolean;
  supports_inline_queries?: boolean;
  supports_guest_queries?: boolean;
  supports_join_request_queries?: boolean;
}
