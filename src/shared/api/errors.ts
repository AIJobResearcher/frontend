/**
 * Transport-level error model. Kinds map one-to-one onto the user-facing error
 * states of `docs/ui/vacancies-market.md` 6.5, so the UI owns the copy.
 */
export type ApiErrorKind =
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'validation'
  | 'rate_limited'
  | 'server'
  | 'network'
  | 'unknown';

interface ApiErrorOptions {
  status?: number;
  correlationId?: string;
  cause?: unknown;
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly correlationId?: string;

  constructor(kind: ApiErrorKind, message: string, options: ApiErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = 'ApiError';
    this.kind = kind;
    this.status = options.status;
    this.correlationId = options.correlationId;
  }
}

export const kindFromStatus = (status: number): ApiErrorKind => {
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not_found';
  if (status === 422) return 'validation';
  if (status === 429) return 'rate_limited';
  if (status >= 500) return 'server';
  return 'unknown';
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

/** Extracts a human-readable reason from an OpenAPI error body when present. */
const reasonFromBody = (body: unknown): string | undefined => {
  if (!isRecord(body)) return undefined;

  const { message, detail } = body;
  if (typeof message === 'string') return message;
  if (typeof detail === 'string') return detail;

  return undefined;
};

export const apiErrorFromResponse = (response: Response, body?: unknown): ApiError => {
  const kind = kindFromStatus(response.status);
  const reason = reasonFromBody(body) ?? response.statusText;

  return new ApiError(kind, reason || `Request failed with status ${response.status}`, {
    status: response.status,
    correlationId: response.headers.get('Correlation-ID') ?? undefined,
  });
};
