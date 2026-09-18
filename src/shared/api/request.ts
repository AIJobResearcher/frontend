import { apiErrorFromResponse } from './errors';

export interface ApiResult<T> {
  data?: T;
  error?: unknown;
  response: Response;
}

/** Turns an openapi-fetch result into data or a typed `ApiError`. */
export const unwrap = <T>({ data, error, response }: ApiResult<T>): T => {
  if (!response.ok || data === undefined) {
    throw apiErrorFromResponse(response, error);
  }

  return data;
};
