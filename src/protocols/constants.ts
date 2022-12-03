import { IngestkoreaError, ingestkoreaErrorCodeChecker } from '@ingestkorea/util-error-handler';
import { HttpResponse, collectBodyString, destroyStream } from '@ingestkorea/util-http-handler';

export const parseBody = async (output: HttpResponse): Promise<any> => {
  const { headers, body: streamBody } = output;
  await verifyJsonHeader(headers['content-type'], streamBody);

  const data = await collectBodyString(streamBody);
  if (data.length) return JSON.parse(data);
  return {};
};

export const parseErrorBody = async (output: HttpResponse): Promise<void> => {
  const { statusCode, headers, body: streamBody } = output;
  await verifyJsonHeader(headers['content-type'], streamBody);

  const data = await collectBodyString(streamBody);
  let customError = new IngestkoreaError({ code: 400, type: 'Bad Request', message: 'Invalid Request' });

  if (ingestkoreaErrorCodeChecker(statusCode)) customError.error.code = statusCode
  if (data.length) customError.error.description = JSON.parse(data)
  throw customError;
};

const verifyJsonHeader = async (contentType: string, streamBody: any): Promise<void> => {
  const isValid = /application\/json/gi.exec(contentType) ? true : false;
  if (!isValid) {
    destroyStream(streamBody);
    throw new IngestkoreaError({
      code: 400, type: 'Bad Request',
      message: 'Invalid Request', description: 'response content-type is not applicaion/json'
    });
  };
  return;
};