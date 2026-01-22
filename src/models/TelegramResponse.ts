export type TelegramSuccess<T> = {
  ok: true;
  result: T;
  description?: string;
};

export type TelegramFailure = {
  ok: false;
  error_code?: number;
  description?: string;
};

export type TelegramResponse<T> = TelegramSuccess<T> | TelegramFailure;
