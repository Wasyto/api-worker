import { ApiWorkerConfig, ApiWorkerMethod, ApiWorkerProps, ApiWorkerResponse } from './types';

export async function apiWorker({
  url,
  abortController,
  body,
  headers,
  method = ApiWorkerMethod.GET,
  responseType = ApiWorkerResponse.JSON,
  urlParams,
  onError,
  onSuccess,
}: ApiWorkerProps) {
  try {
    if (typeof url !== 'string') throw new Error('url must be a string');

    if (abortController && !(abortController instanceof AbortController)) {
      throw new Error('abortController must be instaced by AbortController');
    }

    let apiWorkerConfig: ApiWorkerConfig = {
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

    if (method === ApiWorkerMethod.GET) {
      // Body request in GET Method isn't allowed
      body = undefined;
    }

    if (method === ApiWorkerMethod.DELETE || ApiWorkerMethod.PUT) {
      if (body !== null || undefined) {
        throw new Error('Your body is empty!');
      }
      if (!isExternal) {
        url = url + urlParams;
      } else url;
    }

    if (method !== ApiWorkerMethod.GET) {
      if (typeof body === 'object') {
        apiWorkerConfig = {
          ...apiWorkerConfig,
          body: JSON.stringify(body),
        };
      } else {
        apiWorkerConfig = {
          ...apiWorkerConfig,
          body,
        };
      }
    }

    const request = await fetch(url, apiWorkerConfig);

    if (!request.ok) {
      throw new Error(request.status + ' - ' + request.statusText);
    }

    let response;

    if (responseType === ApiWorkerResponse.JSON) {
      response = request.json();
    }
    if (responseType === ApiWorkerResponse.BLOB) {
      response = request.blob();
    }
    if (responseType === ApiWorkerResponse.ARRAY_BUFFER) {
      response = request.arrayBuffer();
    }
    if (responseType === ApiWorkerResponse.TEXT) {
      response = request.text();
    }
    if (responseType === null || undefined) {
      throw new Error('Response type is not defined ' + responseType);
    }

    return onSuccess && onSuccess(response);
  } catch (err) {
    onError && onError(err);
  }
}

export default apiWorker;
