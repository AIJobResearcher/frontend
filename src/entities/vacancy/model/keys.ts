import type { VacancyFilters } from '@/entities/vacancy/api/vacancies';

/** One cache key per resource and params (rule 5.3). */
export const vacancyKeys = {
  all: ['vacancies'] as const,
  list: (jobId: string, filters: VacancyFilters) =>
    [...vacancyKeys.all, 'list', jobId, filters] as const,
  detail: (id: string) => [...vacancyKeys.all, 'detail', id] as const,
};
