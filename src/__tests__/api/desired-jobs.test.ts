/**
 * @jest-environment node
 */
import { getDesiredJobs } from '@/entities/desired-job/api/desired-jobs';

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const readRequest = (input: unknown): Request => {
  if (!(input instanceof Request)) throw new Error('fetch was not called with a Request');

  return input;
};

describe('getDesiredJobs', () => {
  it('maps the ResearcherCrm jobs to bar entries', async () => {
    const fetchMock = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(jsonResponse([{ id: 'job-1', title: 'Frontend Developer' }]));

    await expect(getDesiredJobs()).resolves.toEqual([
      { jobId: 'job-1', title: 'Frontend Developer' },
    ]);

    const request = readRequest(fetchMock.mock.calls[0][0]);
    expect(request.method).toBe('GET');
    expect(request.url).toContain('/jobs');
    expect(request.headers.get('Correlation-ID')).toBeTruthy();
  });

  it('fails with a typed error when the service rejects the call', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({}, 401));

    await expect(getDesiredJobs()).rejects.toMatchObject({ kind: 'unauthorized' });
  });
});
