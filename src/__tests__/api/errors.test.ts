/**
 * @jest-environment node
 */
import { ApiError, apiErrorFromResponse, kindFromStatus } from '@/shared/api/errors';

describe('kindFromStatus', () => {
  it.each([
    [401, 'unauthorized'],
    [403, 'forbidden'],
    [404, 'not_found'],
    [422, 'validation'],
    [429, 'rate_limited'],
    [500, 'server'],
    [418, 'unknown'],
  ])('maps %i to %s', (status, kind) => {
    expect(kindFromStatus(status)).toBe(kind);
  });
});

describe('apiErrorFromResponse', () => {
  it('carries the status, kind and reason from the body', () => {
    const response = new Response(JSON.stringify({ message: 'Too many requests' }), {
      status: 429,
    });

    const error = apiErrorFromResponse(response, { message: 'Too many requests' });

    expect(error).toBeInstanceOf(ApiError);
    expect(error.kind).toBe('rate_limited');
    expect(error.status).toBe(429);
    expect(error.message).toBe('Too many requests');
  });

  it('falls back to the status text without a body', () => {
    const error = apiErrorFromResponse(new Response(null, { status: 503 }));

    expect(error.kind).toBe('server');
    expect(error.message.length).toBeGreaterThan(0);
  });

  it('ignores a non-record body', () => {
    const error = apiErrorFromResponse(new Response(null, { status: 400 }), 'not a record');

    expect(error.kind).toBe('unknown');
  });
});
