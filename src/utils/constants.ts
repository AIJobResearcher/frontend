import { FilterParams, VacancySort, VacancyStatus } from '@/types/vacancy';

/**
 * App configuration constants
 */

export const SEARCH_DEBOUNCE_MS = 500;

/** `POST /vacancies` pagination defaults (see API contract) */
export const DEFAULT_PAGE = 1;
export const DEFAULT_PER_PAGE = 20;
export const MAX_PER_PAGE = 100;

export const VACANCY_STATUSES: VacancyStatus[] = ['open', 'closed'];

export const SORT_OPTIONS: { value: VacancySort; label: string }[] = [
  { value: 'date', label: 'Newest First' },
  { value: 'salary_asc', label: 'Salary: Low to High' },
  { value: 'salary_desc', label: 'Salary: High to Low' },
];

/** Default search criteria applied when the URL does not specify them */
export const DEFAULT_FILTERS: Partial<FilterParams> = {
  status: 'open',
  sort: 'date',
};

export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
  'Temporary',
];

export const WORKPLACE_TYPES = ['On-site', 'Remote', 'Hybrid'];
