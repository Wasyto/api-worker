import { ApiWorkerConfig, ApiWorkerMethod, ApiWorkerProps, ApiWorkerResponse } from './types';

export async function apiWorker({
  url,
  abortController,
  body,
  headers,
  method = ApiWorkerMethod.GET,
  responseType = ApiWorkerResponse.JSON,
  timeout,
  urlParams,
  onError,
  onSuccess,
}: ApiWorkerProps) {
  try {
    if (typeof url !== 'string') throw 'url must be a string';

    if (abortController && !(abortController instanceof AbortController)) {
      throw 'abortController must be instaced by AbortController';
    }

    let apiWorkerConfig: ApiWorkerConfig = {
      method,
      headers,
    };

    const isExternal = url.startsWith('http');

    if (!isExternal) {
      url = process.env.GATEWAY_API + url;
    }

    if (method === null || undefined) {
      throw 'Method is undefined, please choose a method.';
    }

    if (method === ApiWorkerMethod.GET) {
      // Body request in GET Method isn't allowed
      body = undefined;
    }

    if (method === ApiWorkerMethod.DELETE || ApiWorkerMethod.PUT) {
      if (body != null || undefined) {
        console.log('Your body is empty!');
      }
      !isExternal ? (url = url + urlParams) : url;
    }

    if (method !== ApiWorkerMethod.GET) {
      if (typeof body == 'object') {
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
      throw request.status + ' - ' + request.statusText;
    }

    let response;
    let responseTypes = ApiWorkerResponse;
    console.log(responseTypes);

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
    if (responseType == null || undefined) {
      throw 'Response type is not defined ' + responseType;
    }

    return onSuccess && onSuccess(response);
  } catch (err) {
    onError?.(err);
  }
}

export default apiWorker;
