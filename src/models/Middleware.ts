export type Middleware<Input extends object, Output extends object> = (
  next: Handler<Input, Output>,
  context: any
) => Handler<Input, Output>;

export type Handler<Input extends object, Output extends object> = (args: Input) => Promise<Output>;
