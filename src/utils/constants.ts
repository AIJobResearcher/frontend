/**
 * Application constants
 */

export const VACANCIES_PER_PAGE = 20;
export const SEARCH_DEBOUNCE_MS = 500;

export const EMPLOYMENT_TYPES: Record<string, string> = {
  'full-time': 'Full-Time',
  'part-time': 'Part-Time',
  contract: 'Contract',
  internship: 'Internship',
  volunteer: 'Volunteer',
};

export const WORKPLACE_TYPES: Record<string, string> = {
  remote: 'Remote',
  'on-site': 'On-Site',
  hybrid: 'Hybrid',
};

export const SORT_OPTIONS = [
  { value: 'date', label: 'Latest' },
  { value: 'salary_asc', label: 'Salary: Low to High' },
  { value: 'salary_desc', label: 'Salary: High to Low' },
];
