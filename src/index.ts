
import { ApiWorkerConfig, ApiWorkerMethod, ApiWorkerProps, ApiWorkerResponse, ApiWorkerTokenType } from './types';

export async function apiWorker({
  url,
  abortController,
  body,
  headers,
  method = ApiWorkerMethod.GET,
  responseType = ApiWorkerResponse.JSON,
  onError,
  onSuccess,
  apiToken,
}: ApiWorkerProps) {
  try {
    if (typeof url !== 'string') throw new Error('url must be a string');

    if (abortController && !(abortController instanceof AbortController)) {
      throw new Error('abortController must be instaced by AbortController');
    }

    let config: any = {
      method,
      headers,
    };

    const isExternal = url.startsWith('http');

    if (!isExternal) {
      url = process.env.GATEWAY_API + url;
    }

    if (!method) {
      throw new Error('Method is undefined, please choose a method.');
    }

    if (method !== ApiWorkerMethod.GET) {
      if (typeof body === 'object') {
        config['body'] = JSON.stringify(body);
      } else {
        config['body'] = body;
      }
    }

    const request = await fetch(url, config);

    if (!request.ok) {
      throw new Error(request.status + ' - ' + request.statusText);
    }

    let response;

    switch (responseType) {
      // Process as JSON
      case ApiWorkerResponse.JSON:
        response = await request.json();

        if (response.errors || response.error) {
          return onError?.(response);
        }

        return onSuccess?.(response);

      // Process as blob file
      case ApiWorkerResponse.BLOB:
        response = await request.blob();

        if (response.type === 'text/html') {
          return onError?.('File maybe not found');
        }

        return onSuccess?.(response);

      // Process as array buffer
      case ApiWorkerResponse.ARRAY_BUFFER:
        response = await request.arrayBuffer();

        return onSuccess?.(response);

      // Process as text
      case ApiWorkerResponse.TEXT:
        response = await request.text();

        return onSuccess?.(response);
      default:
        throw new Error("ResponseType doens't match");
    }
  } catch (err) {
    return onError?.(err);
  }
}

export default apiWorker;
