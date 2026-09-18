import { useInfiniteQuery } from '@tanstack/react-query';
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { searchVacancies } from '@/entities/vacancy/api/vacancies';
import type { VacancyFilters, VacancyPage } from '@/entities/vacancy/api/vacancies';
import { vacancyKeys } from '@/entities/vacancy/model/keys';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@/shared/config/constants';

/**
 * Append-only infinite list scoped to one desired job and the active filters
 * (ui 3.4). The query stays idle until `job_id` is known, because the contract
 * requires it.
 */
export const useVacancyList = (
  jobId: string | undefined,
  filters: VacancyFilters = {}
): UseInfiniteQueryResult<InfiniteData<VacancyPage, number>, Error> =>
  useInfiniteQuery({
    queryKey: vacancyKeys.list(jobId ?? '', filters),
    initialPageParam: DEFAULT_PAGE,
    enabled: Boolean(jobId),
    queryFn: ({ pageParam, signal }) => {
      if (!jobId) throw new Error('job_id is required by POST /vacancies');

      return searchVacancies(
        { ...filters, job_id: jobId, page: pageParam, per_page: DEFAULT_PER_PAGE },
        signal
      );
    },
    getNextPageParam: (lastPage) => {
      // An empty next page stops pagination silently (ui 7.2).
      if (lastPage.data.length === 0) return undefined;

      const { current_page, last_page } = lastPage.meta;
      return current_page < last_page ? current_page + 1 : undefined;
    },
  });
