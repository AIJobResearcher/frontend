import { describe, it, expect } from 'vitest';
import { parseFiltersFromSearchParams, buildSearchParamsFromFilters } from '@/pages/HomePage';

describe('HomePage search params', () => {
  it('should apply API defaults when the query string is empty', () => {
    expect(parseFiltersFromSearchParams(new URLSearchParams())).toEqual({
      job_id: undefined,
      employer_id: undefined,
      country: undefined,
      city: undefined,
      min_salary: undefined,
      max_salary: undefined,
      status: 'open',
      sort: 'date',
    });
  });

  it('should parse all supported criteria from the URL', () => {
    const params = new URLSearchParams({
      job_id: 'job-1',
      employer_id: 'emp-2',
      country: 'Ukraine',
      city: 'Kyiv',
      min_salary: '1000',
      max_salary: '5000',
      status: 'closed',
      sort: 'salary_desc',
    });

    expect(parseFiltersFromSearchParams(params)).toEqual({
      job_id: 'job-1',
      employer_id: 'emp-2',
      country: 'Ukraine',
      city: 'Kyiv',
      min_salary: 1000,
      max_salary: 5000,
      status: 'closed',
      sort: 'salary_desc',
    });
  });

  it('should ignore unknown enum values and non numeric salaries', () => {
    const params = new URLSearchParams({
      status: 'archived',
      sort: 'unknown',
      min_salary: 'abc',
    });

    const filters = parseFiltersFromSearchParams(params);

    expect(filters.status).toBe('open');
    expect(filters.sort).toBe('date');
    expect(filters.min_salary).toBeUndefined();
  });

  it('should serialize filters back into the query string without empty values', () => {
    const params = buildSearchParamsFromFilters({
      job_id: 'job-1',
      country: undefined,
      min_salary: 0,
      status: 'open',
      sort: 'date',
    });

    expect(params.get('job_id')).toBe('job-1');
    expect(params.has('country')).toBe(false);
    expect(params.get('min_salary')).toBe('0');
    expect(params.toString()).toBe('job_id=job-1&min_salary=0&status=open&sort=date');
  });

  it('should round-trip filters through the URL', () => {
    const filters = {
      job_id: 'job-1',
      employer_id: 'emp-2',
      country: 'Ukraine',
      city: 'Kyiv',
      min_salary: 1000,
      max_salary: 5000,
      status: 'closed' as const,
      sort: 'salary_asc' as const,
    };

    expect(parseFiltersFromSearchParams(buildSearchParamsFromFilters(filters))).toEqual(filters);
  });
});
