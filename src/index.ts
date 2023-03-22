import { ApiWorkerMethod, ApiWorkerProps, ApiWorkerResponse } from './types';

console.log('Lost is gay!');

async function apiWorker({
  url,
  abortController,
  body,
  headers,
  method = ApiWorkerMethod.GET,
  responseType = ApiWorkerResponse.JSON,
  timeout,
  onError,
  onSuccess,
}: ApiWorkerProps) {
  console.log(typeof headers);
  try {
    if (typeof url !== 'string') throw 'url must be a string';

    if (abortController && !(abortController instanceof AbortController)) {
      throw 'abortController must be instaced by AbortController';
    }

    if (method === ApiWorkerMethod.GET) {
      // Body request in GET Method isn't allowed
      body = undefined;
    }

    const isExternal = url.startsWith('http');

    let apiWorkerConfig: any = {
      method,
      headers,
    };

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

    if (!isExternal) {
      url = process.env.GATEWAY_API + url;
    }
    const request = await fetch(url, apiWorkerConfig);
    if (!request.ok) {
      throw request.status + ' - ' + request.statusText;
    }
    let response;

    // I tried do a bomb, if you want cool, set it on fire!

    // const formatedResponseType = (Object.keys(ApiWorkerResponse) as (keyof typeof ApiWorkerResponse)[]).map(
    //   (key, index) => {
    //     console.log(key);
    //     if (responseType === key) {

    //     }
    //   },
    // );

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
  } catch (err) {
    onError?.(err);
  }
}

export default apiWorker;
