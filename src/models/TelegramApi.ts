export type Success<T> = {
  ok: true;
  result: T;
};

export type Fail = {
  ok: false;
  error_code: number;
  description: string;
};

export type Result<T> = Success<T> | Fail;
