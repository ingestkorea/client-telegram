import { Middleware } from "../models";

export const middlewareSortHeaders: Middleware<any, any> = (next, context) => async (request) => {
  let init: Record<string, string> = {};
  const sortedHeaders = Object.keys(request.headers)
    .sort()
    .reduce((acc, curr) => {
      acc[curr] = request.headers[curr];
      return acc;
    }, init);
  request.headers = sortedHeaders;
  return next(request);
};
