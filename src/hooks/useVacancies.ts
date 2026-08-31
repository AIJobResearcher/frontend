import React from 'react';
import { useMutation, useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { FilterParams, VacancyPreview, VacancyDetail as VacancyDetailType } from '@/types/vacancy';
import { apiClient } from '@/api/client';

const VACANCIES_KEY = ['vacancies'] as const;
const VACANCY_KEY = ['vacancy'] as const;

/**
 * Hook for fetching vacancies list with pagination and filtering
 */
export const useVacancies = (filters?: Partial<FilterParams>) => {
  const [currentFilters, setCurrentFilters] = React.useState<Partial<FilterParams>>(filters || {});

  const { data, isLoading, isFetching, error, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: [VACANCIES_KEY, currentFilters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.get<{
        data: VacancyPreview[];
        total: number;
        page: number;
        per_page: number;
      }>('/vacancies', {
        params: {
          ...currentFilters,
          page: pageParam,
          per_page: 20,
        },
      });
      return response;
    },
    getNextPageParam: (lastPage) => {
      const { page, per_page, total } = lastPage;
      const nextPage = page + 1;
      const totalPages = Math.ceil(total / per_page);
      return nextPage <= totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });

  const vacancies = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  const totalVacancies = data?.pages[0]?.total || 0;

  return {
    vacancies,
    isLoading,
    isLoadingMore: isFetching && !isLoading,
    error: error?.message || null,
    hasMore: !!hasNextPage,
    totalVacancies,
    setFilters: setCurrentFilters,
    fetchMoreVacancies: () => fetchNextPage(),
    retry: () => fetchNextPage(),
  };
};

/**
 * Hook for fetching single vacancy details
 */
export const useVacancyDetail = (id?: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [VACANCY_KEY, id],
    queryFn: async () => {
      if (!id) return null;
      return await apiClient.get<VacancyDetailType>(`/vacancies/${id}`);
    },
    enabled: !!id,
  });

  return {
    vacancy: data || null,
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

/**
 * Hook for applying to a vacancy
 */
export const useApplyVacancy = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async (vacancyId: string) => {
      return await apiClient.post(`/vacancies/${vacancyId}/apply`, {});
    },
  });

  return {
    apply: mutate,
    isApplying: isPending,
  };
};
