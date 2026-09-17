import { apiClient } from './client';
import {
  FilterParams,
  PaginationMeta,
  VacanciesListResponse,
  Vacancy,
  VacancyDetailResponse,
} from '@/types/vacancy';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@/utils/constants';

export const VACANCIES_ENDPOINT = '/vacancies';

type SearchParams = Partial<FilterParams>;

const appendIfPresent = (
  formData: FormData,
  key: keyof FilterParams,
  value: string | number | null | undefined
): void => {
  if (value === undefined || value === null) return;
  if (typeof value === 'string' && value.trim() === '') return;
  formData.append(key, String(value));
};

/**
 * Builds the `multipart/form-data` body for `POST /vacancies`.
 * Empty/undefined criteria are omitted so the backend applies its own defaults.
 */
export const buildVacancySearchFormData = (params: SearchParams = {}): FormData => {
  const formData = new FormData();

  appendIfPresent(formData, 'job_id', params.job_id);
  appendIfPresent(formData, 'employer_id', params.employer_id);
  appendIfPresent(formData, 'country', params.country);
  appendIfPresent(formData, 'city', params.city);
  appendIfPresent(formData, 'min_salary', params.min_salary);
  appendIfPresent(formData, 'max_salary', params.max_salary);
  appendIfPresent(formData, 'status', params.status);
  appendIfPresent(formData, 'per_page', params.per_page ?? DEFAULT_PER_PAGE);
  appendIfPresent(formData, 'page', params.page ?? DEFAULT_PAGE);
  appendIfPresent(formData, 'sort', params.sort);

  return formData;
};

const readTotalCountHeader = (headers: unknown): number | undefined => {
  const raw = (headers as Record<string, unknown> | undefined)?.['x-total-count'];
  if (raw === undefined || raw === null) return undefined;
  const total = Number(raw);
  return Number.isFinite(total) ? total : undefined;
};

const buildMeta = (
  meta: Partial<PaginationMeta> | undefined,
  headers: unknown,
  params: SearchParams
): PaginationMeta => {
  const perPage = meta?.per_page ?? params.per_page ?? DEFAULT_PER_PAGE;
  const total = readTotalCountHeader(headers) ?? meta?.total ?? 0;
  const lastPage = meta?.last_page ?? Math.max(1, Math.ceil(total / perPage));

  return {
    current_page: meta?.current_page ?? params.page ?? DEFAULT_PAGE,
    per_page: perPage,
    total,
    last_page: lastPage,
  };
};

/**
 * Search vacancies: `POST /vacancies` with all criteria in a multipart body.
 * The total number of matches is taken from the `X-Total-Count` response header
 * (falling back to `meta.total`).
 */
export const getVacancies = async (params: SearchParams = {}): Promise<VacanciesListResponse> => {
  const response = await apiClient.post<VacanciesListResponse>(
    VACANCIES_ENDPOINT,
    buildVacancySearchFormData(params),
    {
      // Let axios/browser add the multipart boundary
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );

  return {
    data: response.data?.data ?? [],
    meta: buildMeta(response.data?.meta, response.headers, params),
    links: response.data?.links,
  };
};

export const getVacancyById = async (id: string): Promise<Vacancy> => {
  const response = await apiClient.get<VacancyDetailResponse>(`${VACANCIES_ENDPOINT}/${id}`);
  return response.data.data;
};
