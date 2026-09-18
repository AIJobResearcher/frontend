import { vacanciesMarketClient } from '@/shared/api/clients';
import { unwrap } from '@/shared/api/request';
import type { components, paths } from '@/shared/api/generated/vacancies-market';

export type VacancyPreview = components['schemas']['VacancyPreview'];
export type Vacancy = components['schemas']['Vacancy'];
export type Employer = components['schemas']['Employer'];
export type Interviewer = components['schemas']['Interviewer'];
export type Workplace = components['schemas']['Workplace'];
export type EmploymentType = components['schemas']['EmploymentType'];

type SearchResponse = paths['/vacancies']['post']['responses'][200]['content']['application/json'];

/** Criteria of `POST /vacancies`; `job_id` is required by the contract. */
export type VacancySearchParams = NonNullable<
  paths['/vacancies']['post']['requestBody']
>['content']['application/json'];

/** Optional criteria — everything except the job and the pagination. */
export type VacancyFilters = Omit<VacancySearchParams, 'job_id' | 'page' | 'per_page'>;

/** Pagination block derived from the contract; never duplicated (rule 1.1). */
export type PaginationMeta = SearchResponse['meta'];

export interface VacancyPage {
  data: VacancyPreview[];
  meta: PaginationMeta;
}

/** `POST /vacancies` — JSON body; `job_id` scopes the search. */
export const searchVacancies = async (
  params: VacancySearchParams,
  signal?: AbortSignal
): Promise<VacancyPage> => {
  const result = await vacanciesMarketClient.POST('/vacancies', { body: params, signal });
  const payload = unwrap(result);

  return { data: payload.data, meta: payload.meta };
};

/** `GET /vacancy/{id}` — the contract wraps the vacancy in `data`. */
export const getVacancyById = async (id: string, signal?: AbortSignal): Promise<Vacancy> => {
  const result = await vacanciesMarketClient.GET('/vacancy/{id}', {
    params: { path: { id } },
    signal,
  });

  return unwrap(result).data;
};
