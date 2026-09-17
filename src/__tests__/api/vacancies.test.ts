import { describe, it, expect, vi, beforeEach } from 'vitest';

const { post, get } = vi.hoisted(() => ({ post: vi.fn(), get: vi.fn() }));

vi.mock('@/api/client', () => ({
  apiClient: { post, get },
}));

import { getVacancies, getVacancyById, buildVacancySearchFormData } from '@/api/vacancies';

type PostCall = [string, FormData, { headers: Record<string, string> }];

describe('buildVacancySearchFormData', () => {
  it('should include only the provided criteria with API defaults for paging', () => {
    const formData = buildVacancySearchFormData({ job_id: 'job-1', status: 'open' });

    expect(formData.get('job_id')).toBe('job-1');
    expect(formData.get('status')).toBe('open');
    expect(formData.get('page')).toBe('1');
    expect(formData.get('per_page')).toBe('20');
    expect(formData.has('country')).toBe(false);
    expect(formData.has('min_salary')).toBe(false);
  });

  it('should skip empty strings and undefined values', () => {
    const formData = buildVacancySearchFormData({
      job_id: '   ',
      city: undefined,
      employer_id: 'emp-1',
    });

    expect(formData.has('job_id')).toBe(false);
    expect(formData.has('city')).toBe(false);
    expect(formData.get('employer_id')).toBe('emp-1');
  });

  it('should serialize salary bounds and sorting', () => {
    const formData = buildVacancySearchFormData({
      min_salary: 1000,
      max_salary: 5000,
      sort: 'salary_desc',
      page: 3,
      per_page: 50,
    });

    expect(formData.get('min_salary')).toBe('1000');
    expect(formData.get('max_salary')).toBe('5000');
    expect(formData.get('sort')).toBe('salary_desc');
    expect(formData.get('page')).toBe('3');
    expect(formData.get('per_page')).toBe('50');
  });
});

describe('getVacancies', () => {
  beforeEach(() => {
    post.mockReset();
    get.mockReset();
  });

  it('should POST multipart/form-data to /vacancies', async () => {
    post.mockResolvedValue({
      data: {
        data: [{ id: '1', title: 'Developer' }],
        meta: { current_page: 1, per_page: 20, total: 1, last_page: 1 },
        links: { first: 'a', last: 'a', prev: null, next: null },
      },
      headers: {},
    });

    const response = await getVacancies({ country: 'Ukraine' });
    const [url, body, config] = post.mock.calls[0] as PostCall;

    expect(post).toHaveBeenCalledTimes(1);
    expect(url).toBe('/vacancies');
    expect(body).toBeInstanceOf(FormData);
    expect(body.get('country')).toBe('Ukraine');
    expect(config.headers['Content-Type']).toBe('multipart/form-data');
    expect(response.data).toHaveLength(1);
    expect(response.meta.total).toBe(1);
  });

  it('should prefer the X-Total-Count header for the total', async () => {
    post.mockResolvedValue({
      data: {
        data: [],
        meta: { current_page: 2, per_page: 10, total: 0, last_page: 1 },
      },
      headers: { 'x-total-count': '42' },
    });

    const response = await getVacancies({ page: 2, per_page: 10 });

    expect(response.meta.total).toBe(42);
    expect(response.meta.current_page).toBe(2);
  });

  it('should fall back to computed pagination when meta and header are missing', async () => {
    post.mockResolvedValue({ data: { data: [] }, headers: {} });

    const response = await getVacancies({ page: 4, per_page: 10 });

    expect(response.data).toEqual([]);
    expect(response.meta).toEqual({
      current_page: 4,
      per_page: 10,
      total: 0,
      last_page: 1,
    });
  });
});

describe('getVacancyById', () => {
  beforeEach(() => {
    get.mockReset();
  });

  it('should fetch a single vacancy by id', async () => {
    get.mockResolvedValue({ data: { data: { id: '1', title: 'Developer' } } });

    const vacancy = await getVacancyById('1');

    expect(get).toHaveBeenCalledWith('/vacancies/1');
    expect(vacancy.title).toBe('Developer');
  });
});
