export interface Employer {
  id: string;
  name: string;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
}

export interface VacancyPreview {
  id: string;
  title: string;
  employer_name: string;
  salary_min: number | null;
  salary_max: number | null;
  currency: string;
  location: string;
  published_at: string;
  status: 'open' | 'closed';
  // дополнительные поля для UI (могут отсутствовать в API)
  company_logo?: string;
  company?: string;
  city?: string;
  country?: string;
  employment_type?: string;
  workplace_type?: string;
}

export interface Vacancy {
  id: string;
  title: string;
  description: string;
  employer: Employer;
  requirements?: string[];
  min_salary: number | null;
  max_salary: number | null;
  currency: string;
  country: string;
  city: string;
  employment_type: 'part-time' | 'contract' | 'internship' | 'full-time' | 'volunteer';
  workplace: 'remote' | 'on-site' | 'hybrid';
  posted_at: string;
  status: 'open' | 'closed';
  version: number;
  // дополнительные поля для UI
  company_logo?: string;
  company_description?: string;
  company_website?: string;
  company_email?: string;
  company_phone?: string;
}

export type VacancyDetail = Vacancy;

export type VacancyStatus = 'open' | 'closed';
export type VacancySort = 'date' | 'salary_asc' | 'salary_desc';

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface VacanciesListResponse {
  data: VacancyPreview[];
  meta: PaginationMeta;
  /** Pagination links as returned by the API (omitted by some responses) */
  links?: PaginationLinks;
}

export interface VacancyDetailResponse {
  data: Vacancy;
}

/**
 * Search criteria for `POST /vacancies`.
 * Sent as `multipart/form-data`; every field is optional and nullable.
 */
export interface FilterParams {
  /** Id of the job the vacancy is assigned to */
  job_id?: string;
  /** Filter by employer */
  employer_id?: string;
  /** Filter by country */
  country?: string;
  /** Filter by city */
  city?: string;
  /** Minimum salary (USD) */
  min_salary?: number;
  /** Maximum salary (USD) */
  max_salary?: number;
  /** Vacancy status */
  status?: VacancyStatus;
  /** Number of records per page (max 100, default 20) */
  per_page?: number;
  /** Page number (default 1) */
  page?: number;
  /** Sort field (default `date`) */
  sort?: VacancySort;
}
