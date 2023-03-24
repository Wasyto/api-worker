export enum ApiWorkerMethod {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
  PATCH = 'PATCH',
  PURGE = 'PURGE',
}

export enum ApiWorkerResponse {
  BLOB = 'BLOB',
  JSON = 'JSON',
  ARRAY_BUFFER = 'ARRAY_BUFFER',
  TEXT = 'TEXT',
}

export type ApiWorkerProps = {
  url: string;
  method?: ApiWorkerMethod;
  body?: any;
  headers?: object;
  abortController?: AbortController;
  timeout?: number;
  responseType?: ApiWorkerResponse;
  urlParams?: string;
  onSuccess?: (data: any) => void;
  onError?: (data: any) => void;
};

export type ApiWorkerConfig = Pick<ApiWorkerProps, 'method' & 'headers' & 'body'>;
