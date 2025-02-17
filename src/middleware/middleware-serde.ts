import { Middleware, RequestSerializer, ResponseDeserializer } from "../models";

export const middlewareSerialize =
  (serializer: RequestSerializer<any, any>): Middleware<any, any> =>
  (next, context) =>
  async (input) => {
    const request = await serializer(input, context);
    return next(request);
  };

export const middlewareDeserialize =
  (deserializer: ResponseDeserializer<any, any>): Middleware<any, any> =>
  (next, context) =>
  async (request) => {
    const { response } = await next(request);
    const parsed = await deserializer(response, context);
    return {
      response,
      output: parsed,
    };
  };
