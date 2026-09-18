import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { getVacancyById } from '@/entities/vacancy/api/vacancies';
import type { Vacancy } from '@/entities/vacancy/api/vacancies';
import { vacancyKeys } from '@/entities/vacancy/model/keys';

/** `GET /vacancies/{id}` for the selected vacancy. */
export const useVacancyDetail = (id?: string): UseQueryResult<Vacancy, Error> =>
  useQuery({
    queryKey: vacancyKeys.detail(id ?? ''),
    queryFn: async ({ signal }) => {
      if (!id) throw new Error('Vacancy id is required');

      return getVacancyById(id, signal);
    },
    enabled: Boolean(id),
  });
