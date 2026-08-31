/**
 * App configuration constants
 */

export const SEARCH_DEBOUNCE_MS = 500;

export const SORT_OPTIONS = [
  { value: 'date', label: 'Newest First' },
  { value: 'salary_asc', label: 'Salary: Low to High' },
  { value: 'salary_desc', label: 'Salary: High to Low' },
];

export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
  'Temporary',
];

export const WORKPLACE_TYPES = [
  'On-site',
  'Remote',
  'Hybrid',
];
