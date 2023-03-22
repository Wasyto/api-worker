import { ApiWorkerMethod, ApiWorkerProps, ApiWorkerResponse } from './types';

console.log('Test');

function apiWorker({
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
  } catch (err) {
    onError?.(err);
  }
}

export default apiWorker;
