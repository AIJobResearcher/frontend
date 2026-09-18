/**
 * @jest-environment node
 */
import { getVacancyById, searchVacancies } from '@/entities/vacancy/api/vacancies';
import { ApiError } from '@/shared/api/errors';

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const isRequest = (value: unknown): value is Request => value instanceof Request;

const readRequest = (input: unknown): Request => {
  if (!isRequest(input)) throw new Error('fetch was not called with a Request');

  return input;
};

const pageBody = {
  data: [{ id: 'v1', title: 'Vacancy v1' }],
  meta: { current_page: 2, per_page: 20, total: 21, last_page: 2 },
};

describe('searchVacancies', () => {
  it('posts JSON criteria and normalises the page', async () => {
    const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(pageBody));

    const page = await searchVacancies({
      job_id: 'job-1',
      min_salary: 1000,
      workplace: 'remote',
      posted_from: '2026-09-01T00:00:00.000Z',
    });

    const request = readRequest(fetchMock.mock.calls[0][0]);
    expect(request.method).toBe('POST');
    expect(request.url).toContain('/vacancies');
    expect(request.headers.get('Content-Type')).toContain('application/json');
    await expect(request.json()).resolves.toMatchObject({
      job_id: 'job-1',
      min_salary: 1000,
      workplace: 'remote',
      posted_from: '2026-09-01T00:00:00.000Z',
    });

    expect(page.meta).toEqual({ current_page: 2, per_page: 20, total: 21, last_page: 2 });
    expect(page.data).toHaveLength(1);
  });

  it('stamps every request with a Correlation-ID', async () => {
    const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(pageBody));

    await searchVacancies({ job_id: 'job-1' });

    const request = readRequest(fetchMock.mock.calls[0][0]);
    expect(request.headers.get('Correlation-ID')).toBeTruthy();
  });

  it('throws a typed error on failure', async () => {
    // A fresh Response per call: a body can only be read once.
    jest
      .spyOn(globalThis, 'fetch')
      .mockImplementation(() => Promise.resolve(jsonResponse({}, 429)));

    await expect(searchVacancies({ job_id: 'job-1' })).rejects.toBeInstanceOf(ApiError);
    await expect(searchVacancies({ job_id: 'job-1' })).rejects.toMatchObject({
      kind: 'rate_limited',
    });
  });

  it('maps 401 to unauthorized', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({}, 401));

    await expect(searchVacancies({ job_id: 'job-1' })).rejects.toMatchObject({
      kind: 'unauthorized',
    });
  });
});

describe('getVacancyById', () => {
  it('returns the vacancy from the data envelope', async () => {
    const fetchMock = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(jsonResponse({ data: { id: 'v1', title: 'Vacancy v1' } }));

    await expect(getVacancyById('v1')).resolves.toEqual({ id: 'v1', title: 'Vacancy v1' });

    const request = readRequest(fetchMock.mock.calls[0][0]);
    expect(request.method).toBe('GET');
    expect(request.url).toContain('/vacancy/v1');
  });

  it('maps 404 to not_found', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({}, 404));

    await expect(getVacancyById('missing')).rejects.toMatchObject({ kind: 'not_found' });
  });
});
