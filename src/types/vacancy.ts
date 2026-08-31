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

export interface VacanciesListResponse {
  data: VacancyPreview[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface VacancyDetailResponse {
  data: Vacancy;
}

export interface FilterParams {
  title?: string;
  employer_id?: string;
  country?: string;
  city?: string;
  salary_min?: number;
  salary_max?: number;
  status?: 'open' | 'closed';
  sort?: 'date' | 'salary_asc' | 'salary_desc';
  page: number;
  per_page: number;
}